import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import { initiateSmartContractPlatformClient } from "@circle-fin/smart-contract-platform";
import { v4 as uuidv4 } from "uuid";

const apiKey = process.env.CIRCLE_API_KEY as string;
const entitySecret = process.env.CIRCLE_ENTITY_SECRET as string;

if (!apiKey || !entitySecret) {
  throw new Error(
    "Circle API credentials are not set in environment variables"
  );
}

const walletsClient = initiateDeveloperControlledWalletsClient({
  apiKey,
  entitySecret,
});
const contractClient = initiateSmartContractPlatformClient({
  apiKey,
  entitySecret,
});

interface StatusCheckParams {
  getStatus: (id: string) => Promise<any>;
  checkComplete: (response: any) => boolean;
  checkFailed: (response: any) => boolean;
  id: string;
  maxAttempts?: number;
  interval?: number;
}

export async function checkStatus({
  getStatus,
  checkComplete,
  checkFailed,
  id,
  maxAttempts = 30,
  interval = 10000,
}: StatusCheckParams) {
  let isComplete = false;
  let attempts = 0;
  let lastResponse;
  console.log(`Checking status for ID: ${id}`);
  while (!isComplete && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, interval));
    attempts++;
    try {
      lastResponse = await getStatus(id);
      const status =
        lastResponse.data.contract?.status ||
        lastResponse.data.transaction?.state;
      console.log(`Attempt ${attempts}: Current Status - ${status}`);
      if (checkComplete(lastResponse)) {
        isComplete = true;
        console.log("Operation has been successfully completed.");
      } else if (checkFailed(lastResponse)) {
        console.log("Operation failed.");
        break;
      }
    } catch (error) {
      console.error("Error while checking status:", error);
      break;
    }
  }
  return { isComplete, lastResponse };
}

export async function checkDeploymentStatus(contractId: string) {
  return checkStatus({
    getStatus: async (id) => await contractClient.getContract({ id }),
    checkComplete: (response) => response.data.contract.status === "COMPLETE",
    checkFailed: (response) => response.data.contract.status === "FAILED",
    id: contractId,
  });
}

export async function checkTransactionStatus(transactionId: string) {
  return checkStatus({
    getStatus: async (id) => await walletsClient.getTransaction({ id }),
    checkComplete: (response) => response.data.transaction.state === "COMPLETE",
    checkFailed: (response) =>
      ["FAILED", "DENIED"].includes(response.data.transaction.state),
    id: transactionId,
  });
}

export async function createWalletSet(name: string) {
  const response = await walletsClient.createWalletSet({
    idempotencyKey: uuidv4(),
    name: name,
  });

  console.log("Wallet set created:", JSON.stringify(response.data, null, 2));
  return response.data?.walletSet?.id;
}

export async function createWallets(walletSetId: string) {
  const createWalletOptions = {
    idempotencyKey: uuidv4(),
    accountType: "SCA",
    blockchains: ["MATIC-AMOY"],
    count: 2,
    walletSetId: walletSetId,
  };

  const walletsResponse = await walletsClient.createWallets(
    createWalletOptions
  );
  const wallets = walletsResponse.data?.wallets;
  if (!wallets || wallets.length < 2) {
    throw new Error("Failed to create two wallets.");
  }

  return {
    adminWallet: wallets[0],
    userWallet: wallets[1],
  };
}

export async function deployContract(walletId: string, address: string) {
  console.log(`Deploying contract for wallet ID: ${walletId}`);
  const deploymentContractInput = {
    id: "a1b74add-23e0-4712-88d1-6b3009e85a86",
    blockchain: "MATIC-AMOY",
    name: "Example Token",
    walletId: walletId,
    templateParameters: {
      name: "Example Token",
      symbol: "EXT",
      defaultAdmin: address,
      primarySaleRecipient: address,
      royaltyRecipient: address,
      royaltyPercent: 0,
    },
    fee: {
      type: "level",
      config: {
        feeLevel: "MEDIUM",
      },
    },
  };

  const deploymentResponse = await contractClient.deployContractTemplate(
    deploymentContractInput
  );
  const contractIds = deploymentResponse.data?.contractIds;
  const contractId = contractIds ? contractIds[0] : null;

  if (!contractId) {
    throw new Error("Failed to deploy contract.");
  }

  console.log(`Contract deployment initiated. Contract ID: ${contractId}`);

  const deploymentResult = await checkDeploymentStatus(contractId);
  if (
    !deploymentResult.isComplete ||
    !deploymentResult.lastResponse?.data.contract.contractAddress
  ) {
    throw new Error("Contract deployment failed or timed out.");
  }

  console.log(`Contract deployed successfully. Address: ${deploymentResult.lastResponse.data.contract.contractAddress}`);
  return deploymentResult.lastResponse.data.contract.contractAddress;
}

export async function executeMint(
  walletId: string,
  contractAddress: string,
  amount: string,
  address: string
) {
  const executeMintTransaction = {
    idempotencyKey: uuidv4(),
    abiFunctionSignature: "mintTo(address,uint256)",
    abiParameters: [address, amount],
    contractAddress: contractAddress,
    walletId: walletId,
    fee: {
      type: "level",
      config: {
        feeLevel: "MEDIUM",
      },
    },
  };

  const mintExecutionResponse =
    await walletsClient.createContractExecutionTransaction(
      executeMintTransaction
    );
  const transactionId = mintExecutionResponse.data?.id;

  if (!transactionId) {
    throw new Error("Failed to submit mint transaction.");
  }

  return { transactionId };
}

export async function executeTransfer(
  fromWalletId: string,
  toWalletAddress: string,
  contractAddress: string,
  amount: string
) {
  const executeTransferTransaction = {
    idempotencyKey: uuidv4(),
    abiFunctionSignature: "transfer(address,uint256)",
    abiParameters: [toWalletAddress, amount],
    contractAddress: contractAddress,
    walletId: fromWalletId,
    fee: {
      type: "level",
      config: {
        feeLevel: "MEDIUM",
      },
    },
  };

  const transferExecutionResponse =
    await walletsClient.createContractExecutionTransaction(
      executeTransferTransaction
    );
  const transactionId = transferExecutionResponse.data?.id;

  if (!transactionId) {
    throw new Error("Failed to submit transfer transaction.");
  }

  return { transactionId };
}

export async function getWalletBalance(
  walletId: string,
  contractAddress: string
) {
  const balanceResponse = await walletsClient.getTokenBalance({
    walletId: walletId,
    tokenId: contractAddress,
  });
  return balanceResponse.data.tokenBalance;
}

export async function getTransactionHistory(walletId: string) {
  const historyResponse = await walletsClient.listTransactions({
    walletId: walletId,
  });
  return historyResponse.data.transactions;
}

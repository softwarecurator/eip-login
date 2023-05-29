import { randomStringForEntropy } from '@stablelib/random';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import type { SiweMessage } from './types/siwe';

const publicClient = createPublicClient({
	chain: mainnet,
	transport: http()
});

export const generateNonce = (): string => {
	const nonce = randomStringForEntropy(96);
	if (!nonce || nonce.length < 8) {
		throw new Error('Error during nonce creation.');
	}
	return nonce;
};

export const verify = async (message: SiweMessage, signature: any) => {
	const preparedMessage = prepareMessage(message);
	const valid = await publicClient.verifyMessage({
		address: `0x${message.address.split('0x')[1]}`,
		message: preparedMessage,
		signature
	});

	return valid;
};

export const prepareMessage = (message: SiweMessage) => {
	const header = `${message.domain} wants you to sign in with your Ethereum account:`;
	const uriField = `URI: ${message.uri}`;
	let prefix = [header, message.address].join('\n');
	const versionField = `Version: ${message.version}`;

	const chainField = `Chain ID: ` + message.chainId || '1';

	let nonceField;

	if (message.nonce) {
		nonceField = `Nonce: ${message.nonce}`;
	} else {
		nonceField = `Nonce: ${generateNonce()}`;
	}

	let issuedAt;
	if (message.issuedAt) {
		issuedAt = message.issuedAt;
	} else {
		issuedAt = new Date().toISOString();
	}

	const suffixArray = [uriField, versionField, chainField, nonceField];

	suffixArray.push(`Issued At: ${issuedAt}`);
	let statement;
	if (message.statement) {
		statement = message.statement;
	} else {
		statement = `Login to ${message.domain}`;
	}

	const suffix = suffixArray.join('\n');
	prefix = [prefix, statement].join('\n\n');
	if (statement) {
		prefix += '\n';
	}
	return [prefix, suffix].join('\n');
};

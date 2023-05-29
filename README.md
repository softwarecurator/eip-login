# EIP LOGIN

## Installation

To install the package, run the following command:

```bash
npm install eip-login viem
```

## Examples

[Sveltekit example](https://sveltekit-siwe-example.vercel.app/)

## Usages

```js
import {verify, generateNonce, prepareMessage} from 'eip-login';

const message = {
    domain: string;
	/**Ethereum address performing the signing conformant to capitalization
	 * encoded checksum specified in EIP-55 where applicable. */
	address: string;
	/**Human-readable ASCII assertion that the user will sign, and it must not
	 * contain `\n`. */
	statement?: string;
	/**RFC 3986 URI referring to the resource that is the subject of the signing
	 *  (as in the __subject__ of a claim). */
	uri: string;
	/**Current version of the message. */
	version: string;
	/**EIP-155 Chain ID to which the session is bound, and the network where
	 * Contract Accounts must be resolved. */
	chainId: number;
	/**Randomized token used to prevent replay attacks, at least 8 alphanumeric
	 * characters. */
	nonce: string;
};

const preparedMessage = prepareMessage(message);

//wagmi/core function
const signature = await signMessage({
		message: preparedMessage
	});

const valid = await verify(preparedMessage, signature);
console.log(valid);
```

import { useState } from 'react';
import DataVault, { AuthManager, AsymmetricEncryptionManager, SignerEncryptionManager } from '@rsksmart/ipfs-cpinner-client'
import './App.css';

const serviceUrl = 'https://data-vault.identity.rifos.org'

function App() {
  const [account, setAccount] = useState('')
  const [dataVault, setDataVault] = useState(null)

  const enable = () => window.ethereum.enable()
    .then(([account]) => setAccount(account))

  const did = account ? `did:ethr:rsk:testnet:${account.toLowerCase()}` : ''

  const connectToDataVault = async () => {
    const dataVault = new DataVault({
      serviceUrl,
      authManager: !window.ethereum.isNifty ? new AuthManager({
        did,
        serviceUrl,
        personalSign: (data) => window.ethereum.request({ method: 'personal_sign', params: [data, account] })
      }) : new SignerEncryptionManager.fromWeb3Provider(window.ethereum),
      encryptionManager: await AsymmetricEncryptionManager.fromWeb3Provider(window.ethereum)
    })

    setDataVault(dataVault)
  }

  const getKeys = () => dataVault.getKeys().then(console.log)
  const getStorageInformation = () => dataVault.getStorageInformation().then(console.log)
  const getBackup = () => dataVault.getBackup().then(console.log)
  const create = () => dataVault.create({ key: 'test', content: 'test' }).then(console.log)
  const deleteFile = () => dataVault.delete({ key: 'test' }).then(console.log)
  const get = () => dataVault.get({ key: 'test' }).then(console.log)
  const swap = () => dataVault.swap({ key: 'test', content: 'test_swap' }).then(console.log)

  return (
    <div className="App">
      <h2>Connect Metamask</h2>
      {did ? <p>{did}</p> : <button onClick={enable}>enable</button>}
      <hr />
      <h2>Connect to Data Vault</h2>
      {dataVault ? <p>Ok!</p> : <button onClick={connectToDataVault}>connect</button>}
      <h2>Try it</h2>
      <button onClick={getKeys}>get keys</button>
      <button onClick={getStorageInformation}>get storage information</button>
      <button onClick={getBackup}>get backup</button>
      <button onClick={create}>create</button>
      <button onClick={deleteFile}>delete</button>
      <button onClick={get}>get</button>
      <button onClick={swap}>swap</button>
    </div>
  );
}

export default App;

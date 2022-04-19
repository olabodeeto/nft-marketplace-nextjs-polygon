import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Image from "next/dist/client/image";
import axios from "axios";
import Web3Modal from "web3modal";
import banner from "../assets/banner.png";
import { marketplaceAddress } from "../config";

import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  console.log(nfts);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rpc-mumbai.matic.today"
    );
    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      provider
    );
    const data = await contract.fetchMarketItems();

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    });
    await transaction.wait();
    loadNFTs();
  }

  return (
    <>
      <main className="mt-32 w-full px-1 lg:w-10/12 m-auto">
        <section className="flex flex-col lg:flex-row mt-60">
          <div className="w-full lg:w-6/12 flex flex-col justify-center">
            <h1
              className="text-6xl text-center lg:text-left lg:text-6xl 
            w-full lg:w-11/12 font-bold"
            >
              <span className=" text-purple-800">Discover</span> Collect And
              Sell <span className=" text-purple-800">NFT</span> Assets
            </h1>

            <div className="text-center lg:text-left">
              <button className="py-3 px-14 bg-primarycolor text-white rounded-xl mt-16">
                Explore
              </button>
            </div>
          </div>
          <div className="w-full lg:w-6/12 mt-40 lg:mt-0 anim">
            <Image src={banner} />
          </div>
        </section>
      </main>

      {loadingState === "loaded" && !nfts.length ? (
        <div className="sitebg min-h-60 overflow-scroll py-10 pt-20">
          <h1 className="px-20 py-10 text-3xl text-white">
            No items in marketplace
          </h1>
        </div>
      ) : (
        <>
          <div className="sitebg min-h-60 overflow-scroll py-10 mt-60">
            <div className="flex justify-center w-10/12 m-auto">
              <div className="px-4" style={{ maxWidth: "1600px" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                  {nfts.map((nft, i) => (
                    <div
                      key={i}
                      className="border shadow rounded-xl overflow-hidden"
                    >
                      <img src={nft.image} />
                      <div className="p-4 bg-white">
                        <p
                          style={{ height: "64px" }}
                          className="text-2xl font-semibold"
                        >
                          {nft.name}
                        </p>
                        <div style={{ height: "70px", overflow: "hidden" }}>
                          <p className="text-gray-400">{nft.description}</p>
                        </div>
                      </div>
                      <div className="p-4 bg-black">
                        <p className="text-2xl font-bold text-white">
                          {nft.price} ETH
                        </p>
                        <button
                          className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-12 rounded"
                          onClick={() => buyNft(nft)}
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

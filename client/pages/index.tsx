import { useState, useEffect } from 'react';
import Head from 'next/head';
import { GoPrimitiveDot } from 'react-icons/go';
import Navbar from '../components/Navbar';
import LiveCounterCard from '../components/LiveCounterCard/LiveCounterCard';
import electionChannel from "../services/pusher-events";
import { getCandidateList, getElectionList } from '../utils';
import _ from 'lodash';
import { SmartContract } from '../constants';
import { getStorage } from '../services';
import { toast } from 'react-toastify';

export default function Home() {
  const [electionStatus, setElectionStatus] = useState("");
  const [electionList, setElectionList] = useState([]);
  const [candidateLists, setCandidateLists] = useState([]);
  const loggedInAccountAddress = getStorage("loggedInAccountAddress");

  useEffect(() => {
    (async () => {
      const electionList = await getElectionList();
      const candidateLists = await getCandidateList();

      setCandidateLists(candidateLists);
      setElectionList(electionList);
    })();
  }, []);

  // console.log(electionList[electionList.length - 1]?.selectedCandidates);
  const electionCandidates = _.groupBy(electionList[electionList.length - 1]?.selectedCandidates, (candidate) => candidate.user.province);
  const electionCandidatesArray = Object.entries(electionCandidates);

  electionChannel.bind("start-election-event", () => {
    console.log("election started");
    setElectionStatus("start");
  });

  electionChannel.bind("end-election-event", () => {
    console.log("election ended");
    setElectionStatus("end")
  });

  const casteVote = async (_candidateID: string) => {
    try {
      // validation
      const isAlreadyVoted = _.includes(candidateLists, (candidate) => candidate.user.citizenshipNumber === _candidateID);
      console.log(isAlreadyVoted);

      await SmartContract.methods.vote(_candidateID).send({ from: loggedInAccountAddress });
      toast.success("Vote caste successfully.");
    } catch (err) {
      toast.error("Failed to caste vote !");
    }
  }
  // console.log(electionList)
  return (
    <div>
      <Head>
        <title>DAPP VOTING</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/images/logo.png" />
      </Head>
      <Navbar />
      <div className='px-4 py-3 flex justify-center mt-1'>
        <div>
          <div className='lg:w-[1100px] w-full lg:px-2 max-[1100px]:px-1'>
            <div className='flex items-center'>
              <span className='text-2xl font-bold text-black'>Hot Seats</span>
              <GoPrimitiveDot className={`text-4xl ml-5 mr-1 ${electionStatus === 'start' && "text-danger"}`} />
              <span className='text-[17px]'>{
                !electionStatus ? "NO ELECTION" : (electionStatus === "start" ? "LIVE" : "ENDED")
              }</span>
            </div>
          </div>
          <div className='lg:w-[1100px] flex justify-around flex-wrap'>
            {electionList.length > 0 && electionCandidatesArray.length > 0 && electionCandidatesArray?.map(([key, value]: any) =>
              <LiveCounterCard type={key} data={value} key={key} electionStatus={electionStatus} casteVote={casteVote} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

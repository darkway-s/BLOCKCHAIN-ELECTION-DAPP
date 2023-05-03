import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useDispatch } from 'react-redux';
import { GoPrimitiveDot } from 'react-icons/go';
import Navbar from '../../components/Navbar';
import LiveCounterCard from '../../components/LiveCounterCard/LiveCounterCard';
import electionChannel from "../../services/pusher-events";
import { getCandidateList, getElectionList, getElectionStatus, getFormattedErrorMessage, getVoterList, trimAddress } from '../../utils';
import _ from 'lodash';
import { BTM_BORDER_STYLE, SmartContract } from '../../constants';
import { getStorage } from '../../services';
import { setCandidateList } from '../../redux/reducers/candidateReducer';
import { toast } from 'react-toastify';
import { getVoterDetails } from '../../utils/web3';
import { useTranslations } from 'next-intl';
import CandidateCard from '../../components/LiveCounterCard/CandidateCard';
import AnimatedAvatar from '../../components/AnimatedAvatar';
import TickCircleIcon from '../../components/TickCircleIcon';
import { FaRegDotCircle } from 'react-icons/fa';
import { TiLockClosed } from 'react-icons/ti';

export default function Home() {
  const [electionStatus, setElectionStatus] = useState(null);
  const [electionList, setElectionList] = useState([]);
  const [binaryElection, setBinaryElection] = useState(null);
  const [candidateLists, setCandidateLists] = useState([]);
  const [voterLists, setVoterLists] = useState([]);
  const loggedInAccountAddress = getStorage("loggedInAccountAddress");
  let voteCastEvent = null;

  const dispatch = useDispatch();
  const localT = useTranslations("local_result");
  const isElectionStart = electionStatus === "LIVE";
  const isElectionEnd = electionStatus === "ENDED";


  const fetchAllData = async () => {
    const electionList = await getElectionList();
    const voterLists = await getVoterList();
    const electionStatus = getElectionStatus("Local", electionList);
    const currentElection = electionList?.at(-1);

    console.log(electionStatus)
    if (currentElection?.electionType !== "Local") return;

    setElectionStatus(electionStatus);
    setBinaryElection(currentElection)
    setCandidateLists(currentElection?.candidates);
    setVoterLists(voterLists);
    dispatch(setCandidateList(candidateLists));
    setElectionList(electionList);
  }

  useEffect(() => {

    fetchAllData();

    voteCastEvent = SmartContract.events.VoteCast().on("data", (event: any) => {
      fetchAllData();
    });

    return () => {
      voteCastEvent && voteCastEvent?.unsubscribe();
    }
  }, []);

  electionChannel.bind("start-election-event", () => {
    console.log("election started");
    setElectionStatus("LIVE");
  });

  electionChannel.bind("end-election-event", () => {
    console.log("election ended");
    setElectionStatus("ENDED")
  });

  const casteVote = async (selectedCandidates: any) => {
    try {
      const voterDetails = await getVoterDetails(loggedInAccountAddress);
      const electionAddress = electionList?.at(-1)?.startDate;

      // restrict voting before electin start and end
      if (electionStatus == "ENDED") return toast.warn("Election is over !")
      if (electionStatus !== "LIVE") return toast.warn("Cannot vote before election !");


      // restrict candidate to not vote more than one time
      const isCandidate = candidateLists.find(candidate => {
        return candidate.user._id === loggedInAccountAddress
      })

      if (isCandidate) {
        const isAlreadyVoted = candidateLists.some((candidate: any) => candidate.votedVoterLists.includes(loggedInAccountAddress));
        if (isAlreadyVoted) return toast.error("Candidate can only vote once !")
      }

      // vote limit count
      if (voterDetails.voteLimitCount === "3") return toast.info("You've exceed the vote limit count !");

      const isAlreadyVoted = selectedCandidates?.votedVoterLists?.includes(loggedInAccountAddress) ?? false;

      if (isAlreadyVoted) return toast.error("You've already casted vote !");

      await SmartContract.methods.vote(selectedCandidates?.user?._id, electionAddress).send({ from: loggedInAccountAddress });
      toast.success("Vote caste successfully.");
    } catch (error) {
      console.log(error)
      toast.error(`Failed to caste vote !, ${getFormattedErrorMessage(error.message)}`, { toastId: 2 });
    }
  }


  const winnerAddress = candidateLists[0].votedVoterLists?.length > candidateLists[1].votedVoterLists?.length
    ? candidateLists[0].user._id : candidateLists[1].user._id;

  return (
    <div>
      <Head>
        <title>{localT("title")}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/images/logo.png" />
      </Head>
      <Navbar />
      <div className='lg:px-4 sm:px-4 xsm:px-1 py-3 flex lg:justify-center sm:justify-start xsm:justify-start mt-1'>
        <div className='flex flex-column'>

          {/* province level eleciton */}
          <div className='lg:w-[1100px] xsm:w-full sm:px-4 xsm:px-2'>
            <div className='flex lg:flex-row lg:items-center sm:items-center xsm:items-start sm:flex-row xsm:flex-col'>
              <div className='py-1 pl-3 pr-5 mr-5 flex items-center bg-red-700 rounded-tr-full'>
                <span className='text-slate-100'>{localT("title")}</span>
              </div>
              <div className='flex items-center sm:mt-1 xsm:mt-3'>
                <span className='ml-2 text-lg font-bold text-black'>{localT("hot_seats")}</span>
                <GoPrimitiveDot className={`text-4xl ml-5 mr-1 ${electionStatus === 'LIVE' && "text-danger"}`} />
                <span className='text-[17px]'>{electionStatus}</span>
              </div>
            </div>
          </div>
          <div className='lg:w-[1100px] flex justify-around flex-wrap'>
            {candidateLists && candidateLists.length > 0 && candidateLists?.map((data: any) => {
              const voted = data?.votedVoterLists?.includes(loggedInAccountAddress);

              return (<div>
                <div
                  className={`card__container ${isElectionEnd && data?.user?._id === winnerAddress && 'bg-celebrationGif'} h-fit sm:w-[520px] max-[1140px]:w-full mt-3 border border-1 border-slate-300 rounded-1 overflow-hidden mr-3`}>
                  <div
                    className='card__title pl-4 pt-2 flex items-center bg-slate-100 border-l-0 border-r-0 border-t-0 border-b-2 border-black-500 cursor-pointer'
                  >
                    <h6>{trimAddress(data?.user?._id)}</h6>
                  </div>
                  <div className={`card__body pt-3 pb-2 ${isElectionStart && 'animatedBorder'}`}>
                    <div className='card__body__hot px-4 mb-3 flex'>
                      <AnimatedAvatar src={data?.user?.profile} />
                      <div className='details pt-2 pl-3 mx-3 w-100'>
                        <div className='flex items-center'>
                          <span className='text-xl me-4'>{data?.user?.fullName}</span>
                          {isElectionEnd && data?.user?._id === winnerAddress && <TickCircleIcon />}
                          {isElectionStart && <FaRegDotCircle className='animate-ping text-danger absolute lg:ml-[200px] max-[1100px]:ml-[100px]' />}
                        </div>
                        <div className='flex justify-content-between'>
                          <h1 id='count'>{data?.votedVoterLists?.length}</h1>
                          {
                            !isElectionEnd && <button
                              className={`w-[100px] h-[40px] relative flex justify-center items-center bg-slate-100 ${!voted && "shadow-md"} pt-2 pb-2 px-4 rounded-pill text-sm ${voted && "text-slate-500 cursor-default"}`}
                              onClick={() => !voted && casteVote(data)}
                              disabled={voted}
                            >
                              {
                                voted && <span className='absolute -top-1 -left-2 p-1 rounded-circle bg-slate-200 shadow-md cursor-default'>
                                  <TiLockClosed className='text-slate-500' />
                                </span>
                              }
                              Vote
                            </button>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>)
            }
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

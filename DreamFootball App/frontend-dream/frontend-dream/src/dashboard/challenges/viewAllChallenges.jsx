import React, { useState } from "react";
import AdminSiderbar from "../../components/sidebar/sidebar";
import ChallengeCard from "../../components/challenge/challengeCard";
import EditChallengeForm from "../../components/challenge/editChallengeForm";
import { dummyChallengeData } from "./dummyChallengesData";

const ViewAllChallenges = () => {
    const [challenges, setChallenges] = useState(dummyChallengeData);
    const [selectedChallenge, setSelectedChallenge] = useState(null);

    const handleEditChallenge = (challenge) => {
        console.log("Selected challenge:", challenge);
        setSelectedChallenge(challenge);
    };

    const handleCancelChallenge = (gotChallenge) => {
        setChallenges(challenges.filter((challenge) => challenge.id !== gotChallenge.id));
    };

    const toggleChallengeStatus = (gotChallenge) => {
        setChallenges(challenges.map((challenge) =>
            challenge.id === gotChallenge.id
                ? { ...challenge, status: challenge.status === "active" ? "inactive" : "active" }
                : challenge
        ));
    };

    const handleSubmitEditChallenge = (updatedChallenge) => {
        setChallenges(challenges.map((challenge) =>
            challenge.id === updatedChallenge.id ? updatedChallenge : challenge
        ));
        setSelectedChallenge(null);
    };

    return (
        <div className="">
            <AdminSiderbar />
            <div className="pt-10 flex flex-col justify-start gap-4 mx-auto relative">
                {selectedChallenge && (
                    <div 
                        className="absolute top-0 left-0 border-primary border-2 rounded-md p-1 text-center bg-primary text-white cursor-pointer"
                        onClick={() => setSelectedChallenge(null)}
                    >
                        {"Back"}
                    </div>
                )}
                {selectedChallenge ? (
                    <EditChallengeForm
                        challengeData={selectedChallenge}
                        onSubmit={handleSubmitEditChallenge}
                    />
                ) : (
                    <div className="flex flex-col gap-4">
                        {challenges.length > 0 ? (
                            challenges.map((challenge) => (
                                <ChallengeCard 
                                    key={challenge.id}  
                                    challenge={challenge}
                                    onEdit={handleEditChallenge}
                                    onCancel={handleCancelChallenge}
                                    onToggleStatus={toggleChallengeStatus}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500">No challenges available.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewAllChallenges;

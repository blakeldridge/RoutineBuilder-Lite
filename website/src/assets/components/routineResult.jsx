import { useState, forwardRef, useRef, useImperativeHandle, useEffect } from 'react';
import { Apparatus } from '../utils/apparatus';

const RoutineResult = forwardRef(({ apparatus }, ref) => {
    const [ result, setResult ] = useState(null);
    const [ tipsOpen, setTipsOpen ] = useState(false);

    useImperativeHandle(ref, () => ({
        updateResult: (newResult) => {
            setResult(newResult);
        }
    }));

    if (!result || result.execution == 0) {
        return (
            <div>
                Add Skills to the routine to see your score.
            </div>
        );
    }
    return (
        <div className="flex flex-row justify-between gap-4">
            {apparatus == Apparatus.VAULT ? (
                <div className="flex flex-col justify-start text-left">
                    <h2>SV: {result.vault1}</h2>
                    <div className="flex flex-row gap-4">
                        <p className="flex flex-col text-left whitespace-nowrap overflow-hidden">
                            <span className="text-xs font-semibold text-gray-500">Average</span>
                            <span>{result.average}</span>
                        </p>
                        <p className="flex flex-col text-left whitespace-nowrap overflow-hidden">
                            <span className="text-xs font-semibold text-gray-500">Vault 1</span>
                            <span>{result.vault1}</span>
                        </p>
                        <p className="flex flex-col text-left whitespace-nowrap overflow-hidden">
                            <span className="text-xs font-semibold text-gray-500">Vault 2</span>
                            <span>{result.vault2}</span>
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col justify-start text-left">
                    <h2>SV: {result.score}</h2>
                    <div className="flex flex-row gap-4">
                        <p className="flex flex-col text-left">
                            <span className="text-xs font-semibold text-gray-500">Difficulty</span>
                            <span>{result.difficulty}</span>
                        </p>
                        <p className="flex flex-col text-left">
                            <span className="text-xs font-semibold text-gray-500">Requirements</span>
                            <span>{result.requirements}</span>
                        </p>
                        {result.bonus ? (
                            <p className="flex flex-col text-left">
                                <span className="text-xs font-semibold text-gray-500">Bonus</span>
                                <span>{result.bonus}</span>
                            </p>
                        ) : (<div className="w-8"></div>)}
                        {result.penalty ? (
                            <p className="flex flex-col text-left">
                                <span className="text-xs font-semibold text-red-500">Penalty</span>
                                <span>{result.penalty}</span>
                            </p>
                        ) : (<div className="w-10"></div>)}
                    </div>
                </div>
            )}
            <div className="w-full border justify-center items-center text-center">
                <ul className="flex flex-col h-full m-auto justify-center items-center text-center">
                    {result.corrections.length > 0 ? result.corrections.map(correction => {
                        return (
                            <li>{correction}</li>
                        );
                    }) : (
                        <p>No suggested corrections</p>
                    )}
                </ul>
            </div>
        </div>
    );
});

export default RoutineResult;
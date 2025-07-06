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
        <div className="flex flex-col lg:max-w-[75%] lg:flex-row justify-between gap-4 mx-[10%] lg:mx-auto">
            {apparatus == Apparatus.VAULT ? (
                <div className="flex flex-col justify-start text-left">
                    <h2>SV: {result.vault1.toFixed(2)}</h2>
                    <div className="flex flex-row gap-4">
                        <p className="flex flex-col text-left whitespace-nowrap overflow-hidden">
                            <span className="text-xs font-semibold text-gray-500">Average</span>
                            <span>{result.average.toFixed(2)}</span>
                        </p>
                        <p className="flex flex-col text-left whitespace-nowrap overflow-hidden">
                            <span className="text-xs font-semibold text-gray-500">Vault 1</span>
                            <span>{result.vault1.toFixed(2)}</span>
                        </p>
                        <p className="flex flex-col text-left whitespace-nowrap overflow-hidden">
                            <span className="text-xs font-semibold text-gray-500">Vault 2</span>
                            <span>{result.vault2.toFixed(2)}</span>
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col justify-start text-left">
                    <h2>SV: {result.score.toFixed(2)}</h2>
                    <div className="flex flex-row gap-4">
                        <p className="flex flex-col text-left">
                            <span className="text-xs font-semibold text-gray-500">Execution</span>
                            <span>{result.execution.toFixed(2)}</span>
                        </p>
                        <p className="flex flex-col text-left">
                            <span className="text-xs font-semibold text-gray-500">Difficulty</span>
                            <span>{result.difficulty.toFixed(2)}</span>
                        </p>
                        <p className="flex flex-col text-left">
                            <span className="text-xs font-semibold text-gray-500">Requirements</span>
                            <span>{result.requirements.toFixed(2)}</span>
                        </p>
                        {result.bonus ? (
                            <p className="flex flex-col text-left">
                                <span className="text-xs font-semibold text-gray-500">Bonus</span>
                                <span>{result.bonus.toFixed(2)}</span>
                            </p>
                        ) : (<div className="w-8"></div>)}
                        {result.penalty ? (
                            <p className="flex flex-col text-left">
                                <span className="text-xs font-semibold text-red-500">Penalty</span>
                                <span>{result.penalty.toFixed(2)}</span>
                            </p>
                        ) : (<div className="w-10"></div>)}
                    </div>
                </div>
            )}
            <div className="px-[2%] border justify-center items-center">
                <ul className="flex flex-col h-full my-1 justify-center items-start list-disc pl-2">
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
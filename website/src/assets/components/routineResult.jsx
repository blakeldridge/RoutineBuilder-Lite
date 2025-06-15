import { useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { Apparatus } from '../utils/apparatus';

const RoutineResult = forwardRef(({ apparatus }, ref) => {
    const [ result, setResult ] = useState(null);
    const [ tipsOpen, setTipsOpen ] = useState(false);

    useImperativeHandle(ref, () => ({
        updateResult: (newResult) => {
            setResult(newResult);
        }
    }));

    if (!result) {
        return (
            <div>
                Add Skills to the routine to see your score.
            </div>
        );
    }
    return (
        <div>
            {apparatus == Apparatus.VAULT ? (
                <div>
                    Not implemented
                </div>
            ) : (
                <div>
                    <p>Total : {result.score}</p>
                    <p>Difficulty : {result.difficulty}</p>
                    <p>Requirements : {result.requirements}</p>
                    {result.bonus ? (<p>Bonus : {result.bonus}</p>) : null} 
                    {result.penalty ? (<p>Penalties : {result.penalty}</p>) : null}

                    {tipsOpen ? (
                        <div>
                            <ul>
                                {result.corrections.map(correction => {
                                    return (
                                        <li>{correction}</li>
                                    );
                                })}
                            </ul>

                            <button onClick={() => setTipsOpen(false)}>Close corrections</button>
                        </div>
                    ) : (
                        <div>
                            <button onClick={() => setTipsOpen(true)}>See corrections</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});

export default RoutineResult;
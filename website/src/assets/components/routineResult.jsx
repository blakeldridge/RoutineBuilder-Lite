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
        <div>
            {apparatus == Apparatus.VAULT ? (
                <div>
                    <p>Average Vault : {result.average}</p>
                    <p>Vault 1 : {result.vault1}</p>
                    <p>Vault 2 : {result.vault2}</p>
                </div>
            ) : (
                <div>
                    <p>Total : {result.score}</p>
                    <p>Difficulty : {result.difficulty}</p>
                    <p>Requirements : {result.requirements}</p>
                    {result.bonus ? (<p>Bonus : {result.bonus}</p>) : null} 
                    {result.penalty ? (<p>Penalties : {result.penalty}</p>) : null}
                </div>
            )}
            {tipsOpen ? (
                <div>
                    <ul>
                        {result.corrections.length > 0 ? result.corrections.map(correction => {
                            return (
                                <li>{correction}</li>
                            );
                        }) : (
                            <p>No suggested corrections</p>
                        )}
                    </ul>

                    <button onClick={() => setTipsOpen(false)}>Close corrections</button>
                </div>
            ) : (
                <div>
                    <button onClick={() => setTipsOpen(true)}>See corrections</button>
                </div>
            )}
        </div>
    );
});

export default RoutineResult;
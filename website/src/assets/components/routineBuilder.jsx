import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { fromUrlSlug } from '../utils/navigatePrep';
import { Apparatus } from '../utils/apparatus';

const RoutineBuilder = () => {
    const navigate = useNavigate();
    const { apparatus } = useParams();

    const getSkills = () => {
        return [];
    };

    const skills = getSkills();

    const routine = [null, null, null, null, null, null, null, null];

    if (!apparatus || !Object.values(Apparatus).includes(fromUrlSlug(apparatus))) {
        return <Navigate to="/404" replace />
    }

    const apparatusName = fromUrlSlug(apparatus);

    return (
        <div>
            <button onClick={() => navigate('/')}>Return</button>
            <h1>{apparatusName}</h1>
            <div className="flex flex-col">
                {routine.map((element, index) => {
                    return (
                        <select key={index} id={`select-${index}`} value={element}>
                            <option value={null}>-- Select --</option>
                            {skills.map((skill => (
                                <option value={skill}>{skill}</option>
                            )))}
                        </select>
                    );
                })}
            </div>
        </div>
    );
};

export default RoutineBuilder;
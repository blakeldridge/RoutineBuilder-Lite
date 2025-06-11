import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { fromUrlSlug } from '../utils/navigatePrep';
import { Apparatus } from '../utils/apparatus';
import getSkills from '../utils/getSkills';

const RoutineBuilder = () => {
    const navigate = useNavigate();
    const { apparatus } = useParams();

    const routine = [null, null, null, null, null, null, null, null];

    if (!apparatus || !Object.values(Apparatus).includes(fromUrlSlug(apparatus))) {
        return <Navigate to="/404" replace />
    }

    const apparatusName = fromUrlSlug(apparatus);

    const skills = getSkills(apparatusName);

    return (
        <div>
            <button onClick={() => navigate('/')}>Return</button>
            <h1>{apparatusName}</h1>
            <div className="flex flex-col">
                {routine.map((element, index) => {
                    return (
                        <select key={index} id={`select-${index}`} value={element}>
                            <option value={null}>-- Select --</option>
                            {skills.map(((skill, index) => (
                                <option key={index} value={skill.Name}>{skill.Name}</option>
                            )))}
                        </select>
                    );
                })}
            </div>
        </div>
    );
};

export default RoutineBuilder;
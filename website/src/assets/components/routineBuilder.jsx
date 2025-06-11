import { useParams, useNavigate } from 'react-router-dom';
import { fromUrlSlug } from '../utils/navigatePrep';

const RoutineBuilder = () => {
    const navigate = useNavigate();
    const { apparatus } = useParams();
    const apparatusName = fromUrlSlug(apparatus);

    return (
        <div>
            <button onClick={() => navigate('/')}>Return</button>
            {apparatusName}
        </div>
    );
};

export default RoutineBuilder;
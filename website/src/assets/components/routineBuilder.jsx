import { useParams, Navigate } from 'react-router-dom';
import { fromUrlSlug } from '../utils/navigatePrep';
import { Apparatus } from '../utils/apparatus';

const RoutineBuilder = () => {
    const { apparatus } = useParams();

    if (!apparatus || Object.values(Apparatus).includes(fromUrlSlug(apparatus))) {
        return <Navigate to="/404" replace />
    }

    const apparatusName = fromUrlSlug(apparatus);

    return (
        <div>
            <button onClick={() => navigate('/')}>Return</button>
            {apparatusName}
        </div>
    );
};

export default RoutineBuilder;
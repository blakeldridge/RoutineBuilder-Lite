import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Apparatus } from '../utils/apparatus';
import { toUrlSlug } from '../utils/navigatePrep';

const ApparatusSelector = () => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("authToken");

    useEffect(() => {
        if (isLoggedIn !== "true") {
            navigate("/login");
        }
    })

    const handleClick = (event) => {
        const apparatus = event.currentTarget.dataset.apparatus;
        
        navigate(`/routine-builder/${toUrlSlug(apparatus)}`);
    };

    return (
        <div className="grid grid-cols-3 gap-4 text-lg">
            <button data-apparatus={Apparatus.FLOOR} onClick={handleClick}>{Apparatus.FLOOR}</button>
            <button data-apparatus={Apparatus.POMMEL} onClick={handleClick}>{Apparatus.POMMEL}</button>
            <button data-apparatus={Apparatus.RINGS} onClick={handleClick}>{Apparatus.RINGS}</button>
            <button data-apparatus={Apparatus.VAULT} onClick={handleClick}>{Apparatus.VAULT}</button>
            <button data-apparatus={Apparatus.PBAR} onClick={handleClick}>{Apparatus.PBAR}</button>
            <button data-apparatus={Apparatus.HBAR} onClick={handleClick}>{Apparatus.HBAR}</button>
        </div>
    );
};

export default ApparatusSelector;
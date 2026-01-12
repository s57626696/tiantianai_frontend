import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import WorkbenchHome from "../pages/Workbench/index";
import SettlementReview from "../pages/Workbench/B223";
import {BusinessCategory, BusinessItem} from "../layouts/AppLayout";


interface Props {
    businessData: BusinessCategory[];
    onBusinessClick: (item: BusinessItem) => void;
}

const AppRouter: React.FC<Props> = ({businessData, onBusinessClick}) => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/workbench"/>}/>
            <Route
                path="/workbench"
                element={
                    <WorkbenchHome
                        businessData={businessData}
                        onBusinessClick={onBusinessClick}
                    />
                }
            />
            <Route
                path="/B223"
                element={<SettlementReview/>}
            />
        </Routes>
    );
};

export default AppRouter;

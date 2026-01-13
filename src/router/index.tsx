import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import WorkbenchHome from "../pages/Workbench/index";

import B223 from "../pages/Workbench/B223";
import B223Create from "../pages/Workbench/B223/B223Create";

import {BusinessCategory, BusinessItem} from "../layouts/AppLayout";


interface Props {
    businessData: BusinessCategory[];
    onBusinessClick: (item: BusinessItem) => void;
}

const AppRouter: React.FC<Props> = ({businessData, onBusinessClick}) => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/workbench"/>}/>

            <Route path="/workbench"
                   element={<WorkbenchHome businessData={businessData} onBusinessClick={onBusinessClick}/>}/>

            <Route path="/workbench/b223" element={<B223/>}/>
            <Route path="/workbench/b223/create" element={<B223Create/>}/>

        </Routes>
    );
};

export default AppRouter;

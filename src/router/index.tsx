import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";

import MainFrameLayout from "../layouts/MainFrameLayout";
import WorkbenchLayout from "../layouts/WorkbenchLayout";
import SystemLayout from "../layouts/SystemLayout";

import WorkbenchHome from "../pages/Workbench/index";

import B223 from "../pages/Workbench/B223";
import B223Create from "../pages/Workbench/B223/B223Create";


import Prompts from "../pages/System/Prompts";
import Org from "../pages/System/Org";
import Roles from "../pages/System/Roles";
import Config from "../pages/System/Config";


import {BusinessCategory, BusinessItem} from "../types/business";


interface Props {
    businessData: BusinessCategory[];
    onBusinessClick: (item: BusinessItem) => void;
}

const AppRouter: React.FC<Props> = ({businessData, onBusinessClick}) => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/workbench"/>}/>

            <Route element={<MainFrameLayout/>}>

                <Route element={<WorkbenchLayout/>}>
                    <Route path="/workbench"
                           element={<WorkbenchHome onBusinessClick={onBusinessClick}/>}/>

                    <Route path="/workbench/b223" element={<B223/>}/>
                    <Route path="/workbench/b223/create" element={<B223Create/>}/>
                </Route>

                <Route path="/system" element={<SystemLayout/>}>
                    <Route index element={<Navigate to="/system/prompts"/>}/>
                    <Route path="prompts" element={<Prompts/>}/>
                    <Route path="org" element={<Org/>}/>
                    <Route path="roles" element={<Roles/>}/>
                    <Route path="config" element={<Config/>}/>
                </Route>

            </Route>
        </Routes>
    );
};

export default AppRouter;

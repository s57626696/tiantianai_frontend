import React from "react";
import {BrowserRouter} from "react-router-dom";

import { BreadcrumbProvider } from "./context/BreadcrumbContext";
import AppLayout from "./layouts/AppLayout";


const App: React.FC = () => (
    <BreadcrumbProvider>
        <BrowserRouter>
            <AppLayout/>
        </BrowserRouter>
    </BreadcrumbProvider>
);

export default App;

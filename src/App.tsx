import React from "react";
import {BrowserRouter} from "react-router-dom";

import { BreadcrumbProvider } from "./context/BreadcrumbContext";
import AppRouter from "./router";


const App: React.FC = () => (
    <BreadcrumbProvider>
        <BrowserRouter>
            <AppRouter businessData={[]} onBusinessClick={() => {}} />
        </BrowserRouter>
    </BreadcrumbProvider>
);

export default App;

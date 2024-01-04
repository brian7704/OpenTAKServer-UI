import React from 'react';
import { AppContent } from './components/AppContent';
import { Header } from './components/Header';

const DefaultLayout = () => (
        <div>
            {/*<AppSidebar />*/}
            <div className="wrapper d-flex flex-column min-vh-100">
                <Header />
                <div className="body flex-grow-1">
                    <AppContent />
                </div>
                {/*<AppFooter />*/}
            </div>
        </div>
    );

export default DefaultLayout;

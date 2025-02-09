import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <>
            <div class="main">
                {/* Hero Section */}
                <section className="hero-section text-center">
                    <div className="container my-4">
                        <h1>Welcome to <span className="home-h">Createverse Studio</span></h1>
                        <p className="home-para">AI-powered tools for generating images, icons, backgrounds, PDFs, and more!</p>
                        <Link to="/image-generator" className="btn btn-primary">Start Creating</Link>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="features-section text-center components">
                    <div className="container my-4">
                        <div className="row my-4">
                            <div className="col-md-4">
                                <h3>AI Image Generation</h3>
                                <p className="home-p">Generate stunning images from descriptive text.</p>
                            </div>
                            <div className="col-md-4">
                                <h3>Icon Generation</h3>
                                <p className="home-p">Create unique icons based on your input.</p>
                            </div>
                            <div className="col-md-4">
                                <h3>PDF Generation</h3>
                                <p className="home-p">Generate PDFs on selected images.</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <h3>Background Generation</h3>
                                <p className="home-p">Create custom backgrounds based on user input.</p>
                            </div>
                            <div className="col-md-6">
                                <h3>Background Removal</h3>
                                <p className="home-p">Remove backgrounds from your images seamlessly.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default HomePage;

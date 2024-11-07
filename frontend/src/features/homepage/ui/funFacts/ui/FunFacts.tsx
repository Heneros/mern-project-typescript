import React, { useState, useEffect } from 'react';
import Counter from './Counter';
export const FunFacts = () => {
    return (
        <>
            <div className="fun-facts">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="wrapper">
                                <div className="row">
                                    <div className="col-lg-4">
                                        <div className="counter">
                                            <Counter
                                                target={100}
                                                speed={1000}
                                            />

                                            <p className="count-text ">
                                                Buildings
                                                <br />
                                                Finished Now
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="counter">
                                            <Counter target={12} speed={1000} />

                                            <p className="count-text ">
                                                Years
                                                <br />
                                                Experience
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="counter">
                                            <Counter target={24} speed={1000} />

                                            <p className="count-text ">
                                                Awwards
                                                <br />
                                                Won 2023
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

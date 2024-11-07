import React from 'react';
import { PropItems } from 'shared/types/PostInfo';
import { PropertyItem } from 'shared/ui/PropertyItem';

export const HomePageProperties: React.FC<PropItems> = ({ propItems }) => {
    return (
        <>
            <div className="properties section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 offset-lg-4">
                            <div className="section-heading text-center">
                                <h6>| Properties</h6>
                                <h2>We Provide The Best Property You Like</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {propItems.length > 0
                            ? propItems.map((item) => (
                                  <PropertyItem key={item._id} {...item} />
                              ))
                            : null}
                    </div>
                </div>
            </div>
        </>
    );
};

"use client";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const ProfileMainContainer: React.FC<Props> = ({ children }) => {
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-10 col-xl-8">{children}</div>
    </div>
  );
};

export default ProfileMainContainer;



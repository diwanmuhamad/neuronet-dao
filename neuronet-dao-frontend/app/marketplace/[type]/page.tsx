"use client";

import { useParams } from "next/navigation";
import Header from "@/components/layout/header/Header";
import CommonBanner from "@/components/layout/banner/CommonBanner";
import ShopSection from "@/components/containers/shop/ShopSection";
import FooterTwo from "@/components/layout/footer/FooterTwo";
import InitCustomCursor from "@/components/layout/InitCustomCursor";
import ScrollProgressButton from "@/components/layout/ScrollProgressButton";
import Animations from "@/components/layout/Animations";

const MarketplaceTypePage = () => {
  const params = useParams();
  const type = params.type as "prompt" | "dataset" | "ai_output";
  return (
    <div className="my-app">
      <Header />
      <main>
        <CommonBanner
          title={`Our ${type !== "ai_output" ? type : "ai output"}`}
        />
        <ShopSection type={type} />
      </main>
      <FooterTwo />
      {/* <InitCustomCursor />
      <ScrollProgressButton /> */}
      {/* <Animations /> */}
    </div>
  );
};

export default MarketplaceTypePage;

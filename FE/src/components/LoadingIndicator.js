import { Spin } from "react-cssfx-loading";

const LoadingIndicator = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        top: "0",
        left: "0",
        opacity: "0.6",
        backgroundColor: "lightGrey",
        position: "fixed",
        zIndex: "9999",
      }}
    >
      <Spin color="#0d6efd" duration="2s" />
    </div>
  );
};

export default LoadingIndicator;
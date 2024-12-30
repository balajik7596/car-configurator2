import React from "react";

function App() {
  return (
    <div style={{ width: "100dvw", height: "100dvh" }}>
      <iframe
        src="/three-scene"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="React Three Fiber Scene"
      />
    </div>
  );
}

export default App;

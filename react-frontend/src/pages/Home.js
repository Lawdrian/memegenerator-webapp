import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { set } from "lodash";

export default function Home() {
  const [memes, setMemes] = useState(Array.from({ length: 20 }));
  const [hasMore, setHasMore] = useState(true);
  const fetchMoreData = () => {
    if (memes.length < 2000) {
      setTimeout(() => {
        setMemes(memes.concat(Array.from({ length: 20 })));
      }, 1500);
    } else {
      setHasMore(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <InfiniteScroll
        dataLength={memes.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        
      >
        {memes.map((i, index) => (
          <div style={{ height: 400 }} key={index}>
            Image - #{index + 1}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

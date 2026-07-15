import React from "react";

const Counter = () => {
  return (
    <section className="py-32 bg-[#000000] text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 opacity-20 pointer-events-none"></div>
        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-16">
            <div className="max-w-xl">
              <h3 className="font-display-lg text-4xl md:text-5xl mb-6">
                A Global Network of Performance.
              </h3>
              <p className="text-on-primary-container text-body-lg mb-8">
                Operating in 12 major financial hubs across three continents,
                providing consistency for the global professional.
              </p>
              <div className="flex gap-4">
                <button className="bg-white text-black px-8 py-3 rounded-brand font-label-sm text-label-sm uppercase tracking-widest hover:bg-zinc-200 transition-colors">
                  Explore Locations
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-12 text-center">
              <div>
                <div className="text-6xl font-black mb-2 counter">12</div>
                <p className="font-label-sm text-label-sm text-on-primary-container tracking-widest uppercase">
                  Major Cities
                </p>
              </div>
              <div>
                <div>
                  <div className="text-6xl font-black mb-2 counter">150</div>
                  <p className="font-label-sm text-label-sm text-on-primary-container tracking-widest uppercase">
                    Premium Cars
                  </p>
                </div>
              </div>
              <div>
                <div>
                  <div className="text-6xl font-black mb-2 counter">24</div>
                  <p className="font-label-sm text-label-sm text-on-primary-container tracking-widest uppercase">
                    Hour Support
                  </p>
                </div>
              </div>
              <div>
                <div>
                  <div className="text-6xl font-black mb-2 counter">98</div>
                  <p className="font-label-sm text-label-sm text-on-primary-container tracking-widest uppercase">
                    % Satisfaction
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Counter;

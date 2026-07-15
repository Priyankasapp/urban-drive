import React from "react";

const Counter = () => {
  return (
    <section className="relative overflow-hidden bg-black py-24 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-16 px-6 lg:flex-row lg:px-8">
        {/* Left Content */}
        <div className="max-w-xl">
          <h2 className="text-4xl font-bold leading-tight md:text-5xl">
            A Global Network of Performance.
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-300">
            Operating in 12 major financial hubs across three continents,
            providing consistency for the global professional.
          </p>

          <button className="mt-8 rounded-full bg-white px-8 py-3 text-sm font-semibold uppercase tracking-widest text-black transition hover:bg-gray-200">
            Explore Locations
          </button>
        </div>

        {/* Right Counters */}
        <div className="grid grid-cols-2 gap-10 text-center sm:gap-14">
          <div>
            <h3 className="text-5xl font-extrabold md:text-6xl">12</h3>
            <p className="mt-3 text-sm uppercase tracking-[0.25em] text-gray-400">
              Major Cities
            </p>
          </div>

          <div>
            <h3 className="text-5xl font-extrabold md:text-6xl">150</h3>
            <p className="mt-3 text-sm uppercase tracking-[0.25em] text-gray-400">
              Premium Cars
            </p>
          </div>

          <div>
            <h3 className="text-5xl font-extrabold md:text-6xl">24</h3>
            <p className="mt-3 text-sm uppercase tracking-[0.25em] text-gray-400">
              Hour Support
            </p>
          </div>

          <div>
            <h3 className="text-5xl font-extrabold md:text-6xl">98%</h3>
            <p className="mt-3 text-sm uppercase tracking-[0.25em] text-gray-400">
              Satisfaction
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Counter;

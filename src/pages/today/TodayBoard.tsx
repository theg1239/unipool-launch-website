import { useCallback, useEffect, useState } from "react";
import RouteMini from "@/components/RouteMini";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
import { DOWNLOAD_URL, rideLink } from "@/config";
import {
  type Ride,
  fetchUpcomingRides,
  shortenLocation,
  firstName,
  seatsLabel,
  perSeat,
  timeOnly,
} from "@/utils/rides";

export default function TodayBoard() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useDocumentTitle(
    "Leaving today · UniPool",
    "Every student carpool departing today, updated live. Find a seat or post your own.",
  );

  const refresh = useCallback(() => {
    setLoading(true);
    fetchUpcomingRides()
      .then((all) => {
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        setRides(all.filter((r) => new Date(r.start_time).getTime() <= end.getTime()));
        setLastRefresh(new Date());
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
    const iv = setInterval(refresh, 60_000);
    return () => clearInterval(iv);
  }, [refresh]);

  return (
    <section className="min-h-[calc(100svh-4rem)] bg-cream px-6 py-9 sm:py-12">
      <div className="container-x max-w-xl">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-500 opacity-70" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime-500" />
          </span>
          <span className="text-[13px] font-bold text-forest/55">Updating live</span>
        </div>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-forest sm:text-[34px]">
          Leaving today
        </h1>
        <p className="mt-2 text-[15px] text-forest/55">
          Every ride departing today, refreshed each minute.
        </p>

        <div className="mt-7">
          {loading && rides.length === 0 ? (
            <div className="space-y-2.5">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="animate-[ticket-pulse_1.4s_ease-in-out_infinite] rounded-[20px] bg-white p-5 shadow-card">
                  <div className="h-3.5 w-44 rounded-full bg-forest/8" />
                  <div className="mt-4 h-3 w-28 rounded-full bg-forest/8" />
                </div>
              ))}
            </div>
          ) : rides.length === 0 ? (
            <div className="rounded-[20px] bg-white px-6 py-12 text-center shadow-card">
              <p className="text-[17px] font-extrabold text-forest">No rides posted for today</p>
              <p className="mt-1.5 text-[14px] text-forest/45">
                Open the app and post yours. Others heading the same way can hop in.
              </p>
              <a href={DOWNLOAD_URL} className="mt-5 inline-flex items-center justify-center rounded-2xl bg-forest px-6 py-3 text-[15px] font-extrabold text-lime">
                Post a ride
              </a>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {rides.map((ride) => (
                <li key={ride.id}>
                  <a
                    href={rideLink(ride.id)}
                    className="block rounded-[20px] bg-white px-5 py-4 shadow-card transition active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <RouteMini className="min-w-0 flex-1" start={shortenLocation(ride.start_location)} end={shortenLocation(ride.end_location)} />
                      <div className="shrink-0 text-right">
                        <p className="text-[14px] font-extrabold text-forest">{timeOnly(ride.start_time)}</p>
                        <p className="mt-0.5 text-[13px] text-forest/50">₹{perSeat(ride)} pp</p>
                      </div>
                    </div>
                    <p className="mt-3 text-[13px] text-forest/45">
                      Hosted by {firstName(ride.host_user_name)} · {seatsLabel(ride)}
                      {ride.created_at && isRecent(ride.created_at) ? (
                        <span className="ml-2 font-bold text-accentorange">Just listed</span>
                      ) : null}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {rides.length > 0 ? (
          <div className="mt-7 flex items-center justify-between">
            <a href={DOWNLOAD_URL} className="inline-flex items-center justify-center rounded-2xl bg-forest px-6 py-3 text-[15px] font-extrabold text-lime transition active:scale-[0.98]">
              Post a ride
            </a>
            {lastRefresh ? (
              <span className="text-[12px] text-forest/35">
                Updated {lastRefresh.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function isRecent(iso: string): boolean {
  try { return Date.now() - new Date(iso).getTime() < 30 * 60_000; } catch { return false; }
}

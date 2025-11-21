const EBIRD_API_BASE = "https://api.ebird.org/v2";
const VEDANTHANGAL_HOTSPOT = "L1076228";

export interface EbirdObservation {
  speciesCode: string;
  comName: string;
  sciName: string;
  howMany: number | null;
  obsDt: string;
  locId: string;
  locName: string;
  lat: number;
  lng: number;
}

export interface TimelineMonth {
  month: number;
  count: number;
  date: string;
}

async function fetchEbirdData(url: string): Promise<any> {
  const apiKey = process.env.EBIRD_API_KEY;
  console.log(`DEBUG: API Key set? ${!!apiKey}, URL: ${url}`);
  
  if (!apiKey) {
    console.warn("EBIRD_API_KEY not set, using fallback data");
    return null;
  }

  try {
    const response = await (globalThis as any).fetch(url, {
      headers: {
        "X-eBirdApiToken": apiKey,
      },
    });

    console.log(`DEBUG: API response status: ${response.status}`);
    const text = await response.text();
    console.log(`DEBUG: API response text: ${text.substring(0, 200)}`);

    if (!response.ok) {
      console.error(`eBird API error: ${response.status} - ${text}`);
      return null;
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Error fetching from eBird API:", error);
    return null;
  }
}

export async function get2025Timeline(): Promise<TimelineMonth[]> {
  try {
    // Fetch recent observations (past 30 days is max allowed by eBird API)
    const url = `${EBIRD_API_BASE}/data/obs/${VEDANTHANGAL_HOTSPOT}/recent?back=30`;
    const data = (await fetchEbirdData(url)) as EbirdObservation[] | null;

    if (!data || !Array.isArray(data)) {
      console.log("No eBird data available, using fallback");
      return getFallback2025Timeline();
    }

    // Group by month for 2025 only
    const monthlyData: { [key: number]: number } = {};
    for (let i = 0; i < 12; i++) {
      monthlyData[i] = 0;
    }

    data.forEach((obs) => {
      // Parse date: format is "2025-02-09 14:30"
      const date = new Date(obs.obsDt);
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth();

      if (year === 2025) {
        monthlyData[month] += obs.howMany || 1;
      }
    });

    // Convert to array of {month: 0-11, count: number}
    return Object.entries(monthlyData).map(([month, count]) => ({
      month: parseInt(month),
      count: count as number,
      date: new Date(2025, parseInt(month), 1).toISOString(),
    }));
  } catch (error) {
    console.error("Error getting 2025 timeline:", error);
    return getFallback2025Timeline();
  }
}

export async function getTopSpecies2025(
  limit: number = 5
): Promise<Array<{ name: string; count: number; status: string }>> {
  try {
    const url = `${EBIRD_API_BASE}/data/obs/${VEDANTHANGAL_HOTSPOT}/recent?back=30`;
    const data = (await fetchEbirdData(url)) as EbirdObservation[] | null;

    if (!data || !Array.isArray(data)) {
      return getFallbackTopSpecies();
    }

    // Count species sightings in 2025
    const speciesMap: { [key: string]: number } = {};

    data.forEach((obs) => {
      const date = new Date(obs.obsDt);
      if (date.getUTCFullYear() === 2025) {
        const key = obs.comName;
        speciesMap[key] = (speciesMap[key] || 0) + (obs.howMany || 1);
      }
    });

    // Sort and get top N
    return Object.entries(speciesMap)
      .map(([name, count]) => ({
        name,
        count: count as number,
        status: "",
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch (error) {
    console.error("Error getting top species:", error);
    return getFallbackTopSpecies();
  }
}

function getFallback2025Timeline(): TimelineMonth[] {
  // Real 2025 eBird data for Vedanthangal Bird Sanctuary (from ebird.org/hotspot/L1076228)
  return [
    { month: 0, count: 233, date: "2025-01-01" },     // Jan: Winter migration
    { month: 1, count: 1837, date: "2025-02-01" },    // Feb: Peak winter species
    { month: 2, count: 587, date: "2025-03-01" },     // Mar: Post-winter
    { month: 3, count: 0, date: "2025-04-01" },       // Apr: No data
    { month: 4, count: 141, date: "2025-05-01" },     // May: Pre-monsoon
    { month: 5, count: 0, date: "2025-06-01" },       // Jun: Monsoon
    { month: 6, count: 0, date: "2025-07-01" },       // Jul: Monsoon
    { month: 7, count: 0, date: "2025-08-01" },       // Aug: Monsoon
    { month: 8, count: 0, date: "2025-09-01" },       // Sep: Monsoon end
    { month: 9, count: 42, date: "2025-10-01" },      // Oct: Post-monsoon start
    { month: 10, count: 736, date: "2025-11-01" },    // Nov: Post-monsoon (from eBird API recent)
    { month: 11, count: 0, date: "2025-12-01" },      // Dec: Not yet
  ];
}

function getFallbackTopSpecies(): Array<{
  name: string;
  count: number;
  status: string;
}> {
  return [
    { name: "Black-headed Ibis", count: 2000, status: "" },
    { name: "Glossy Ibis", count: 1500, status: "" },
    { name: "Little Egret", count: 1500, status: "" },
    { name: "Little Cormorant", count: 1200, status: "" },
    { name: "Asian Openbill", count: 1000, status: "" },
  ];
}

export function calculateTotal2025(timeline: TimelineMonth[]): number {
  return timeline.reduce((sum, m) => sum + m.count, 0);
}

export interface EBirdObservation {
  speciesCode: string;
  comName: string;
  sciName: string;
  locName: string;
  obsDt: string;
  howManyStr?: string;
  howManyAtleast?: number;
  subId: string;
}

export interface MigrationInsight {
  species: string;
  status: string;
  trend: string;
  observation_frequency: number;
}

// eBird API service
export class EBirdService {
  private apiKey: string = process.env.EBIRD_API_KEY || "";
  private baseUrl = "https://api.ebird.org/v2";
  
  // Fetch recent notable observations (rare birds, unusual sightings)
  async getRecentNotables(region: string = "IN-TG"): Promise<EBirdObservation[]> {
    try {
      if (!this.apiKey) {
        console.log("eBird API key not configured, using mock data");
        return this.getMockNotables();
      }
      
      const url = `${this.baseUrl}/data/obs/${region}/recent/notable?key=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error("eBird API error:", response.status);
        return this.getMockNotables();
      }
      
      const data = await response.json();
      return data.slice(0, 10);
    } catch (error) {
      console.error("Error fetching eBird notables:", error);
      return this.getMockNotables();
    }
  }

  // Get migration status for a region
  async getMigrationStatus(region: string = "IN-TG"): Promise<{
    status: string;
    trend: string;
    month: string;
    insights: string[];
  }> {
    try {
      const currentMonth = new Date().getMonth();
      const monthName = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"][currentMonth];
      
      // In winter months (Dec, Jan, Feb), migratory birds are active
      const isWinterMigration = [11, 0, 1].includes(currentMonth);
      // In monsoon (Jun-Sep) and post-monsoon (Oct-Nov) breeding season ends
      const isBreedingSeason = [2, 3, 4, 5].includes(currentMonth);
      
      let status = "Peak Migration Season";
      let trend = "Increasing arrivals";
      let insights: string[] = [];

      if (isWinterMigration) {
        status = "Winter Migration Peak";
        trend = "Northern birds migrating south";
        insights = [
          "Peak season for migratory water birds (herons, storks, pelicans)",
          "Massive congregation at wetlands and lakes",
          "Best time for birdwatching in the sanctuary",
          "Grey Herons, Painted Storks, and Spot-billed Pelicans at their highest numbers",
        ];
      } else if (isBreedingSeason) {
        status = "Breeding Season";
        trend = "Stable populations";
        insights = [
          "Migratory birds beginning their return northward",
          "Local breeding species establishing territories",
          "Lesser activity compared to winter",
        ];
      } else {
        status = "Summer/Monsoon Transition";
        trend = "Moderate activity";
        insights = [
          "Residual migratory species still present",
          "Local breeding birds active",
          "Monsoon creating temporary habitat expansion",
        ];
      }

      return { status, trend, month: monthName, insights };
    } catch (error) {
      console.error("Error determining migration status:", error);
      return { status: "Unknown", trend: "Unknown", month: "", insights: [] };
    }
  }

  // Get species abundance trends
  async getAbundanceTrends(): Promise<MigrationInsight[]> {
    try {
      // Mock implementation - in production this would call eBird frequency/checklists endpoints
      return [
        {
          species: "Grey Heron",
          status: "Very Common",
          trend: "Increasing",
          observation_frequency: 92,
        },
        {
          species: "Painted Stork",
          status: "Common",
          trend: "Stable",
          observation_frequency: 78,
        },
        {
          species: "Spot-billed Pelican",
          status: "Common",
          trend: "Stable",
          observation_frequency: 71,
        },
        {
          species: "White Ibis",
          status: "Uncommon",
          trend: "Increasing",
          observation_frequency: 64,
        },
        {
          species: "Black-headed Ibis",
          status: "Common",
          trend: "Stable",
          observation_frequency: 58,
        },
      ];
    } catch (error) {
      console.error("Error fetching abundance trends:", error);
      return [];
    }
  }

  private getMockNotables(): EBirdObservation[] {
    return [
      {
        speciesCode: "greyhe",
        comName: "Grey Heron",
        sciName: "Ardea cinerea",
        locName: "Vedanthangal Bird Sanctuary",
        obsDt: "2024-11-21T07:30:00Z",
        howManyStr: "12",
        howManyAtleast: 12,
        subId: "S12345",
      },
      {
        speciesCode: "paints1",
        comName: "Painted Stork",
        sciName: "Mycteria leucocephala",
        locName: "Vedanthangal Bird Sanctuary",
        obsDt: "2024-11-21T08:15:00Z",
        howManyStr: "8",
        howManyAtleast: 8,
        subId: "S12346",
      },
      {
        speciesCode: "spotpe1",
        comName: "Spot-billed Pelican",
        sciName: "Pelecanus philippensis",
        locName: "Vedanthangal Bird Sanctuary",
        obsDt: "2024-11-21T09:00:00Z",
        howManyStr: "5",
        howManyAtleast: 5,
        subId: "S12347",
      },
    ];
  }
}

export const eBirdService = new EBirdService();

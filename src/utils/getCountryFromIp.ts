interface CountryResponse {
  country_code: string;
  country_name: string;
}

export const getCountryFromIp = async (ip: string): Promise<CountryResponse> => {
  try {
    const response = await fetch(`https://api.ipapi.com/api/${ip}?access_key=YOUR_API_KEY`);
    const data = await response.json();
    return {
      country_code: data.country_code || 'UN',
      country_name: data.country_name || 'Unknown'
    };
  } catch (error) {
    console.error('Error fetching country:', error);
    return {
      country_code: 'UN',
      country_name: 'Unknown'
    };
  }
};
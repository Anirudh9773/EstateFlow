/**
 * Complete list of all UK postcode areas with their names.
 * Used for agent area-of-operation multi-select and property-agent matching.
 */

export interface PostcodeArea {
  code: string
  name: string
}

export const UK_POSTCODE_AREAS: PostcodeArea[] = [
  // London
  { code: "EC", name: "East Central London" },
  { code: "WC", name: "West Central London" },
  { code: "E", name: "East London" },
  { code: "N", name: "North London" },
  { code: "NW", name: "North West London" },
  { code: "SE", name: "South East London" },
  { code: "SW", name: "South West London" },
  { code: "W", name: "West London" },

  // England
  { code: "AL", name: "St Albans" },
  { code: "B", name: "Birmingham" },
  { code: "BA", name: "Bath" },
  { code: "BB", name: "Blackburn" },
  { code: "BD", name: "Bradford" },
  { code: "BH", name: "Bournemouth" },
  { code: "BL", name: "Bolton" },
  { code: "BN", name: "Brighton" },
  { code: "BR", name: "Bromley" },
  { code: "BS", name: "Bristol" },
  { code: "CA", name: "Carlisle" },
  { code: "CB", name: "Cambridge" },
  { code: "CH", name: "Chester" },
  { code: "CM", name: "Chelmsford" },
  { code: "CO", name: "Colchester" },
  { code: "CR", name: "Croydon" },
  { code: "CT", name: "Canterbury" },
  { code: "CV", name: "Coventry" },
  { code: "CW", name: "Crewe" },
  { code: "DA", name: "Dartford" },
  { code: "DE", name: "Derby" },
  { code: "DH", name: "Durham" },
  { code: "DL", name: "Darlington" },
  { code: "DN", name: "Doncaster" },
  { code: "DT", name: "Dorchester" },
  { code: "DY", name: "Dudley" },
  { code: "EN", name: "Enfield" },
  { code: "EX", name: "Exeter" },
  { code: "FY", name: "Blackpool" },
  { code: "GL", name: "Gloucester" },
  { code: "GU", name: "Guildford" },
  { code: "HA", name: "Harrow" },
  { code: "HD", name: "Huddersfield" },
  { code: "HG", name: "Harrogate" },
  { code: "HP", name: "Hemel Hempstead" },
  { code: "HR", name: "Hereford" },
  { code: "HU", name: "Hull" },
  { code: "HX", name: "Halifax" },
  { code: "IG", name: "Ilford" },
  { code: "IP", name: "Ipswich" },
  { code: "KT", name: "Kingston upon Thames" },
  { code: "L", name: "Liverpool" },
  { code: "LA", name: "Lancaster" },
  { code: "LE", name: "Leicester" },
  { code: "LN", name: "Lincoln" },
  { code: "LS", name: "Leeds" },
  { code: "LU", name: "Luton" },
  { code: "M", name: "Manchester" },
  { code: "ME", name: "Medway" },
  { code: "MK", name: "Milton Keynes" },
  { code: "NE", name: "Newcastle upon Tyne" },
  { code: "NG", name: "Nottingham" },
  { code: "NN", name: "Northampton" },
  { code: "NR", name: "Norwich" },
  { code: "OL", name: "Oldham" },
  { code: "OX", name: "Oxford" },
  { code: "PE", name: "Peterborough" },
  { code: "PL", name: "Plymouth" },
  { code: "PO", name: "Portsmouth" },
  { code: "PR", name: "Preston" },
  { code: "RG", name: "Reading" },
  { code: "RH", name: "Redhill" },
  { code: "RM", name: "Romford" },
  { code: "S", name: "Sheffield" },
  { code: "SK", name: "Stockport" },
  { code: "SL", name: "Slough" },
  { code: "SM", name: "Sutton" },
  { code: "SN", name: "Swindon" },
  { code: "SO", name: "Southampton" },
  { code: "SP", name: "Salisbury" },
  { code: "SR", name: "Sunderland" },
  { code: "SS", name: "Southend-on-Sea" },
  { code: "ST", name: "Stoke-on-Trent" },
  { code: "TF", name: "Telford" },
  { code: "TN", name: "Tonbridge" },
  { code: "TQ", name: "Torquay" },
  { code: "TR", name: "Truro" },
  { code: "TS", name: "Teesside" },
  { code: "TW", name: "Twickenham" },
  { code: "UB", name: "Uxbridge" },
  { code: "WA", name: "Warrington" },
  { code: "WD", name: "Watford" },
  { code: "WF", name: "Wakefield" },
  { code: "WN", name: "Wigan" },
  { code: "WR", name: "Worcester" },
  { code: "WS", name: "Walsall" },
  { code: "WV", name: "Wolverhampton" },
  { code: "YO", name: "York" },

  // Scotland
  { code: "AB", name: "Aberdeen" },
  { code: "DD", name: "Dundee" },
  { code: "DG", name: "Dumfries" },
  { code: "EH", name: "Edinburgh" },
  { code: "FK", name: "Falkirk" },
  { code: "G", name: "Glasgow" },
  { code: "HS", name: "Outer Hebrides" },
  { code: "IV", name: "Inverness" },
  { code: "KA", name: "Kilmarnock" },
  { code: "KW", name: "Kirkwall" },
  { code: "KY", name: "Kirkcaldy" },
  { code: "ML", name: "Motherwell" },
  { code: "PA", name: "Paisley" },
  { code: "PH", name: "Perth" },
  { code: "TD", name: "Galashiels" },
  { code: "ZE", name: "Lerwick (Shetland)" },

  // Wales
  { code: "CF", name: "Cardiff" },
  { code: "LD", name: "Llandrindod Wells" },
  { code: "LL", name: "Llandudno" },
  { code: "NP", name: "Newport" },
  { code: "SA", name: "Swansea" },
  { code: "SY", name: "Shrewsbury" },

  // Northern Ireland
  { code: "BT", name: "Belfast" },

  // Crown Dependencies
  { code: "GY", name: "Guernsey" },
  { code: "IM", name: "Isle of Man" },
  { code: "JE", name: "Jersey" },
]

/**
 * Extract the postcode area prefix from a full UK postcode.
 * e.g. "SW1A 1AA" → "SW", "M1 1AE" → "M", "B33 8TH" → "B"
 */
export function extractPostcodeArea(postcode: string): string {
  const cleaned = postcode.trim().toUpperCase()
  // UK postcode area is 1-2 letters at the start
  const match = cleaned.match(/^([A-Z]{1,2})/)
  return match ? match[1] : ''
}

/**
 * Check if a property postcode matches any of the agent's area codes.
 * @param agentAreas Comma-separated area codes, e.g. "SW,EC,W"
 * @param propertyPostcode Full postcode, e.g. "SW1A 1AA"
 */
export function doesPostcodeMatchAreas(agentAreas: string, propertyPostcode: string): boolean {
  if (!agentAreas || !propertyPostcode) return false

  const areaList = agentAreas.split(',').map(a => a.trim().toUpperCase())
  const postcodePrefix = extractPostcodeArea(propertyPostcode)

  if (!postcodePrefix) return false

  return areaList.some(area => {
    if (area === 'ALL' || area === 'NATIONWIDE') return true
    return area === postcodePrefix
  })
}

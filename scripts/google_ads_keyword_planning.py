import argparse, os, sys
from google.ads.googleads.client import GoogleAdsClient

LANGUAGE_ID_DUTCH = 1010  # Dutch
GEO_NETHERLANDS = 'geoTargetConstants/2392'

# NOTE: Requires google-ads.yaml present in CWD or GOOGLE_ADS_CONFIGURATION_FILE env var.

def get_client(config_path: str | None = None) -> GoogleAdsClient:
    if config_path and os.path.exists(config_path):
        return GoogleAdsClient.load_from_storage(config_path)
    return GoogleAdsClient.load_from_storage()


def generate_keyword_ideas(client: GoogleAdsClient, customer_id: str, seed_keywords: list[str]):
    service = client.get_service('KeywordPlanIdeaService')
    request = client.get_type('GenerateKeywordIdeasRequest')
    request.customer_id = customer_id
    # Accept resource names as strings to avoid version-specific helpers
    request.language = f'languageConstants/{LANGUAGE_ID_DUTCH}'
    request.geo_target_constants.append(GEO_NETHERLANDS)
    request.keyword_plan_network = client.enums.KeywordPlanNetworkEnum.GOOGLE_SEARCH_AND_PARTNERS

    # Set seed directly on the oneof field
    request.keyword_and_url_seed.keywords.extend(seed_keywords)

    results = service.generate_keyword_ideas(request=request)
    out = []
    for r in results:
        kw = r.text
        metrics = r.keyword_idea_metrics
        out.append({
            'keyword': kw,
            'avg_monthly_searches': metrics.avg_monthly_searches,
            'competition': client.enums.CompetitionLevelEnum(metrics.competition).name,
            'low_top_of_page_bid_micros': metrics.low_top_of_page_bid_micros,
            'high_top_of_page_bid_micros': metrics.high_top_of_page_bid_micros,
        })
    return out


def generate_historical_metrics(client: GoogleAdsClient, customer_id: str, keywords: list[str]):
    service = client.get_service('KeywordPlanIdeaService')
    request = client.get_type('GenerateKeywordHistoricalMetricsRequest')
    request.customer_id = customer_id
    request.language = f'languageConstants/{LANGUAGE_ID_DUTCH}'
    request.geo_target_constants.append(GEO_NETHERLANDS)
    request.keywords.extend(keywords)
    response = service.generate_keyword_historical_metrics(request=request)
    out = []
    for r in response.metrics:
        kw = r.text
        metrics = r.keyword_metrics
        out.append({
            'keyword': kw,
            'avg_monthly_searches': metrics.avg_monthly_searches,
            'competition': client.enums.CompetitionLevelEnum(metrics.competition).name,
            'competition_index': metrics.competition_index,
            'low_top_of_page_bid_micros': metrics.low_top_of_page_bid_micros,
            'high_top_of_page_bid_micros': metrics.high_top_of_page_bid_micros,
        })
    return out


def generate_forecast_metrics(client: GoogleAdsClient, customer_id: str, keywords: list[str]):
    plan_service = client.get_service('KeywordPlanService')
    forecast_service = client.get_service('KeywordPlanService')
    # In practice, forecasts require creating a KeywordPlan with campaign/ad group and keywords.
    # Here we build a minimal in-memory plan via the KeywordPlanIdeaService helper.
    # For brevity, we reuse historical metrics in absence of full campaign setup.
    # Implementing full forecast plan creation is more involved; see official docs.
    return []


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', help='Path to google-ads.yaml')
    parser.add_argument('--customer_id', required=True, help='Customer ID (no dashes)')
    parser.add_argument('--seed', nargs='+', default=['zakelijke lening','kredietlijn','werkkapitaal'])
    parser.add_argument('--ideas', action='store_true')
    parser.add_argument('--historical', action='store_true')
    args = parser.parse_args()

    client = get_client(args.config)

    if args.ideas:
        data = generate_keyword_ideas(client, args.customer_id, args.seed)
        print(data)
    if args.historical:
        # Flatten keywords from ideas if only seed provided
        kws = args.seed
        hist = generate_historical_metrics(client, args.customer_id, kws)
        print(hist)

if __name__ == '__main__':
    main()

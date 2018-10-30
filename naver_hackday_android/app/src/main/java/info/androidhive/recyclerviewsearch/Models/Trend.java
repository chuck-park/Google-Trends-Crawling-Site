package info.androidhive.recyclerviewsearch.Models;

import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;
import java.util.Collection;

/**
 * Created by ravi on 16/11/17.
 */

public class Trend {

    @SerializedName("default")
    public Default mDefault;

    public Trend() {

    }

    public class Default {
        @SerializedName("trendingSearchesDays")
        public ArrayList<TrendingSearchesDays> trendingSearchesDays;

        @SerializedName("endDateForNextRequest")
        public String endDateForNextRequest;

        @SerializedName("rssFeedPageUrl")
        public String rssFeedPageUrl;
    }

    public class TrendingSearchesDays {
        public String date;
        public String formattedDate;
        public ArrayList<TrendingSearches> trendingSearches;
    }

    public class TrendingSearches {
        public Title title;
        public String formattedTraffic;
        public Image image;
    }

    public class Title {
        public String query;
        public String exploreLink;
    }

    public class Image {
        public String neewsUrl;
        public String source;
        public String imageUrl;
    }

    public Default getDefault() {
        return mDefault;
    }

    public ArrayList<TrendingSearchesDays> getTrendingSearchesDays() {
        return mDefault.trendingSearchesDays;
    }

    public String getEndDateForNextRequest() {
        return mDefault.endDateForNextRequest;
    }
}

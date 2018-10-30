package info.androidhive.recyclerviewsearch.Models;

public class MyTrend {

    String title;
    String image;
    String traffic;
    String formattedDate;

    public MyTrend() {
    }

    public String getTitle() {
        return title;
    }

    public String getImageUrl() {
        return image;
    }

    public String getTraffic() {
        return traffic;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setImageUrl(String image) {
        this.image = image;
    }

    public void setTraffic(String traffic) {
        this.traffic = traffic;
    }

    public String getFormattedDate() {
        return formattedDate;
    }

    public void setFormattedDate(String formattedDate) {
        this.formattedDate = formattedDate;
    }
}

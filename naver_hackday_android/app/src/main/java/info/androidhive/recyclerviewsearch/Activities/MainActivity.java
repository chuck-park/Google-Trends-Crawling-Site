package info.androidhive.recyclerviewsearch.Activities;

import android.app.SearchManager;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.DividerItemDecoration;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.SearchView;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import info.androidhive.recyclerviewsearch.Adapters.MyTrendsAdapter;
import info.androidhive.recyclerviewsearch.Models.Day;
import info.androidhive.recyclerviewsearch.Models.MyTrend;
import info.androidhive.recyclerviewsearch.Models.Trend;
import info.androidhive.recyclerviewsearch.MyApplication;
import info.androidhive.recyclerviewsearch.MyDividerItemDecoration;
import info.androidhive.recyclerviewsearch.R;

import static info.androidhive.recyclerviewsearch.Api.ApiClient.BASE_URL;

public class MainActivity extends AppCompatActivity implements MyTrendsAdapter.MyTrendsAdapterListener {
    private static final String TAG = MainActivity.class.getSimpleName();
    private RecyclerView recyclerView;
    private List<MyTrend> myTrendList;
    private List<MyTrend> tempList;
    private MyTrendsAdapter mAdapter;
    private SearchView searchView;

    private MyTrend myTrend;

    // url to fetch contacts json
    private String url;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        // toolbar fancy stuff
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setTitle(R.string.toolbar_title);

        recyclerView = findViewById(R.id.recycler_view);
        myTrendList = new ArrayList<>();
        mAdapter = new MyTrendsAdapter(this, myTrendList, this);
        tempList = new ArrayList<>();

        // white background notification bar
        whiteNotificationBar(recyclerView);

        RecyclerView.LayoutManager mLayoutManager = new LinearLayoutManager(getApplicationContext());
        recyclerView.setLayoutManager(mLayoutManager);
        recyclerView.setItemAnimator(new DefaultItemAnimator());
        recyclerView.addItemDecoration(new MyDividerItemDecoration(this, DividerItemDecoration.VERTICAL, 36));
        recyclerView.setAdapter(mAdapter);

//        fetchContacts();
        url = BASE_URL + "/crawler/trends";

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest
                (Request.Method.GET, url, null, new Response.Listener<JSONObject>() {

                    @Override
                    public void onResponse(JSONObject response) {
                        Trend trend = new Gson().fromJson(response.toString(), Trend.class);
                        for(Trend.TrendingSearchesDays day : trend.mDefault.trendingSearchesDays) {
                            MyTrend date = new MyTrend();
                            date.setFormattedDate(day.formattedDate);
                            tempList.add(date);

                            for(Trend.TrendingSearches search : day.trendingSearches) {
                                myTrend = new MyTrend();
                                myTrend.setTitle(search.title.query);
                                myTrend.setTraffic(search.formattedTraffic);
                                myTrend.setImageUrl(search.image.imageUrl);
                                tempList.add(myTrend);
                            }
                        }

                        // adding contacts to contacts list
//                        myTrendList.clear();
                        myTrendList.addAll(tempList);
                        // refreshing recycler view
                        mAdapter.notifyDataSetChanged();
                    }
                }, new Response.ErrorListener() {

                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // TODO: Handle error
                        Log.d(TAG, "error: " + error.toString());
                    }
                });

        MyApplication.getInstance().addToRequestQueue(jsonObjectRequest);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);

        // Associate searchable configuration with the SearchView
        SearchManager searchManager = (SearchManager) getSystemService(Context.SEARCH_SERVICE);
        searchView = (SearchView) menu.findItem(R.id.action_search)
                .getActionView();
        searchView.setSearchableInfo(searchManager
                .getSearchableInfo(getComponentName()));
        searchView.setMaxWidth(Integer.MAX_VALUE);

        // listening to search query text change
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                // filter recycler view when query submitted
                mAdapter.getFilter().filter(query);
                return false;
            }

            @Override
            public boolean onQueryTextChange(String query) {
                // filter recycler view when text is changed
                mAdapter.getFilter().filter(query);
                return false;
            }
        });
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_search) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onBackPressed() {
        // close search view on back button pressed
        if (!searchView.isIconified()) {
            searchView.setIconified(true);
            return;
        }
        super.onBackPressed();
    }

    private void whiteNotificationBar(View view) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            int flags = view.getSystemUiVisibility();
            flags |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
            view.setSystemUiVisibility(flags);
            getWindow().setStatusBarColor(Color.WHITE);
        }
    }

    @Override
    public void onTrendSelected(MyTrend myTrend) {
        Toast.makeText(getApplicationContext(), "Selected: " + myTrend.getTitle() + ", " + myTrend.getTraffic(), Toast.LENGTH_LONG).show();
    }
}

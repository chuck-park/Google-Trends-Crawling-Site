package info.androidhive.recyclerviewsearch.Adapters;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Filter;
import android.widget.Filterable;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;

import java.util.ArrayList;
import java.util.List;

import info.androidhive.recyclerviewsearch.Models.MyTrend;
import info.androidhive.recyclerviewsearch.Models.Trend;
import info.androidhive.recyclerviewsearch.R;

/**
 * Created by ravi on 16/11/17.
 */

public class MyTrendsAdapter extends RecyclerView.Adapter<MyTrendsAdapter.MyViewHolder>
        implements Filterable {
    private Context context;
    private List<MyTrend> myTrendList;
    private List<MyTrend> myTrendListFiltered;
    private MyTrendsAdapterListener listener;

    public class MyViewHolder extends RecyclerView.ViewHolder {
        public TextView title, traffic, date;
        public ImageView thumbnail;

        public MyViewHolder(View view) {
            super(view);
            title = view.findViewById(R.id.title);
            traffic = view.findViewById(R.id.traffic);
            date = view.findViewById(R.id.date);
            thumbnail = view.findViewById(R.id.thumbnail);

            view.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    // send selected contact in callback
                    listener.onTrendSelected(myTrendListFiltered.get(getAdapterPosition()));
                }
            });
        }
    }


    public MyTrendsAdapter(Context context, List<MyTrend> trendList, MyTrendsAdapterListener listener) {
        this.context = context;
        this.listener = listener;
        this.myTrendList = trendList;
        this.myTrendListFiltered = trendList;
    }

    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.user_row_item, parent, false);

        return new MyViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(MyViewHolder holder, final int position) {
        final MyTrend myTrend = myTrendListFiltered.get(position);
        holder.title.setText(myTrend.getTitle());
        holder.traffic.setText(myTrend.getTraffic());
        holder.date.setText(myTrend.getFormattedDate());

        Glide.with(context)
                .load(myTrend.getImageUrl())
                .apply(RequestOptions.circleCropTransform())
                .into(holder.thumbnail);
    }

    @Override
    public int getItemCount() {
        return myTrendListFiltered.size();
    }

    @Override
    public Filter getFilter() {
        return new Filter() {
            @Override
            protected FilterResults performFiltering(CharSequence charSequence) {
                String charString = charSequence.toString();
                if (charString.isEmpty()) {
                    myTrendListFiltered = myTrendList;
                } else {
                    List<MyTrend> filteredList = new ArrayList<>();
                    for (MyTrend row : myTrendList) {

                        // title match condition. this might differ depending on your requirement
                        // here we are looking for title or traffic number match
//                        if (row.getTitle().toLowerCase().contains(charString.toLowerCase()) || row.getFormattedDate().contains(charSequence)) {
//                            filteredList.add(row);
//                        }
                    }

                    myTrendListFiltered = filteredList;
                }

                FilterResults filterResults = new FilterResults();
                filterResults.values = myTrendListFiltered;
                return filterResults;
            }

            @Override
            protected void publishResults(CharSequence charSequence, FilterResults filterResults) {
                myTrendListFiltered = (ArrayList<MyTrend>) filterResults.values;
                notifyDataSetChanged();
            }
        };
    }

    public interface MyTrendsAdapterListener {
        void onTrendSelected(MyTrend myTrend);
    }
}

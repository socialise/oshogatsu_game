package jp.co.proken.register;

import android.content.DialogInterface;
import android.os.Bundle;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.NumberPicker;
import android.widget.TextView;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;

public class MainActivity extends AppCompatActivity
		implements DialogInterface.OnClickListener, View.OnClickListener{

	private int count = 3; //初期値は3

	private AlertDialog alertDialog;
	private TextView statusText;
	private Util util;
	private static final String TAG = "MainActivity";

	private ArrayList<String> member;
	private boolean ready = false;
	private String HOST_URL = "URL";

	@Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

	    connect();

	    initViews();

	    ViewGroup vg = (ViewGroup) findViewById(R.id.root);
	    util = new Util(vg);
	    util.setViewGroup(count);

	    while(!ready){

	    }
	    util.addMember(member);
	    Toast.makeText(this, "接続しました。", Toast.LENGTH_SHORT).show();

	    statusText.setVisibility(View.GONE);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

	private void initViews(){
		NumberPicker picker = new NumberPicker(this);
		picker.setOnValueChangedListener(new NumberPicker.OnValueChangeListener() {
			@Override
			public void onValueChange(NumberPicker picker, int oldVal, int newVal) {
				count = newVal;
			}
		});
		picker.setMinValue(3);
		picker.setMaxValue(8);
		picker.setWrapSelectorWheel(false); //循環しないようにする

		alertDialog = new AlertDialog.Builder(this)
				.setTitle("人数を選択してください")
				.setView(picker)
				.setPositiveButton("OK", this)
				.create();

		Button changeButton = (Button) findViewById(R.id.changeNumber); // 人数の変更をするとき
		assert changeButton != null;
		changeButton.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				alertDialog.show();

			}
		});

		Button sendButton = (Button) findViewById(R.id.send); //
		assert sendButton != null;
		sendButton.setOnClickListener(this);

		statusText = (TextView) findViewById(R.id.statusText);
	}

	//ダイアログのOKボタンを押した時
	@Override
	public void onClick(DialogInterface dialog, int which) {

		util.setViewGroup(count);
	}

	private void connect(){
		Thread thread = new Thread(new Runnable() {
			@Override
			public void run() {
				member = new ArrayList<>();
				try {
					HttpURLConnection con =(HttpURLConnection) new URL(HOST_URL).openConnection();
					con.setRequestMethod("GET");

					// HTTPレスポンスコード
					final int status = con.getResponseCode();
					if (status == HttpURLConnection.HTTP_OK) {
						Log.v("MainActivity", "接続成功");

						StringBuilder result = new StringBuilder();
						// 通信に成功した
						// テキストを取得する
						final InputStream in = con.getInputStream();
						if(in != null) {

							final InputStreamReader inReader = new InputStreamReader(in, "UTF-8");
							final BufferedReader bufReader = new BufferedReader(inReader);
							String line = null;

							// 1行ずつテキストを読み込む
							while ((line = bufReader.readLine()) != null) {
								result.append(line);
							}
							bufReader.close();
							inReader.close();
							in.close();

							Log.v("connection test", result.toString());

							String str = result.toString();
							String[] names = str.substring(1, str.length() - 1).split(",");

							for (String name : names){
								Log.v(TAG, "JSON分割：" + name);
								member.add(name);

							}

						}else Log.v(TAG, "inがnull");
					}
				} catch (IOException e) {
					e.printStackTrace();
					Log.v("network error" ,e.getMessage());
				}finally {
					ready = true;
				}
			}
		});
		thread.start();

	}

	//送信ボタンを押したとき
	@Override
	public void onClick(View v) {
		//util.getSelected()

		ArrayList<Player> players = new ArrayList<>();

		for (int i = 0; i < util.getSize(); i++){
			Player player = util.getSelected(i);

			if(player != null /*&& "選択なし".equals(player.name)*/){
				players.add(player);
				Log.v("player 確認", player.name + "さんは" + player.point + "点獲得");
			}
		}
	}
}

package jp.co.proken.register;

import android.content.Context;
import android.content.res.Resources;
import android.util.Log;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;

import java.util.ArrayList;
import java.util.List;

public class Util implements Controller {

	private final String defaultStr = "選択なし";
	private ViewGroup root;
	private ArrayList<Spinner>  spinners= new ArrayList<>();

	public Util(ViewGroup root){
		this.root = root;

	}

	@Override
	public Player getSelected(int index) {
		ViewGroup group = (ViewGroup) root.getChildAt(index);
		Spinner spinner = (Spinner) group.getChildAt(0);
		RadioGroup radioGroup = (RadioGroup) group.getChildAt(1);

		int id = radioGroup.getCheckedRadioButtonId();
		RadioButton selected = (RadioButton)group.findViewById(id);

		for (int i = 0; i < group.getChildCount(); i++){
			Log.v("util groupリスト index:" + i, group.getChildAt(i).toString());
		}

		Player player = new Player();

		player.name = spinner.getSelectedItem().toString();

		Log.v("util test", player.name);

		String grade = selected.getText().toString(); //階級

		Resources resource = root.getContext().getResources();
		String daihugo = resource.getString(R.string.daihugo);
		String hugo = resource.getString(R.string.hugo);
		String heimin = resource.getString(R.string.heimin);
		String hinmin = resource.getString(R.string.hinmin);
		String daihinmin = resource.getString(R.string.daihinmin);

		if(grade.equals(daihugo)){ //大富豪
			player.point = 4;
		}else if(grade.equals(hugo)){ //富豪
			player.point = 3;
		}else if(grade.equals(heimin)){ //平民
			player.point = 2;
		}else if(grade.equals(hinmin)){ //貧民
			player.point = 1;
		}else if(grade.equals(daihinmin)){ //大貧民
			player.point = 0;
		}

		return player;
	}

	@Override
	public void addMember(List<String> names) {
//		String [] strings =  (String[])names.toArray(new String[0]);
//		String items[] = {"items1","items2","items3"};
		//names.toArray(strings);
		names.add(0, defaultStr);

		ArrayAdapter<String> adapter = new ArrayAdapter<>(root.getContext(), android.R.layout.simple_spinner_item, names);
		for(Spinner spinner : spinners){
			spinner.setAdapter(adapter);
		}
		//adapter.add("test");

		//ArrayAdapter adapter =
//		    new ArrayAdapter(this, android.R.layout.simple_spinner_item, names);
		  //adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
		  //spinner.setAdapter(adapter);
	}

	@Override
	public void setViewGroup(int count) {

		//全削除
		root.removeAllViews();
		
		for(int i = 0; i < count; i++){
			root.addView(vgFactory());
		}
	}

	private ViewGroup vgFactory(){
		Context context = root.getContext(); //Context入手
		//Resources resource = context.getResources(); //リソース取得

		LinearLayout vg = new LinearLayout(context);
		vg.setOrientation(LinearLayout.VERTICAL);
		
		RadioGroup radioGroup = new RadioGroup(context);
		radioGroup.setOrientation(LinearLayout.HORIZONTAL);
		
		int[] resIds = new int[]{
				R.string.daihugo,
				R.string.hugo,
				R.string.heimin,
				R.string.hinmin,
				R.string.daihinmin
		};

		for(int i = 0; i < resIds.length; i++){
			RadioButton radioButton = new RadioButton(context);
			radioButton.setText(resIds[i]);
			radioGroup.addView(radioButton);
		}

		final int WRAP_CONTENT = ViewGroup.LayoutParams.WRAP_CONTENT;
		final int MATCH_PARENT = ViewGroup.LayoutParams.MATCH_PARENT;

		Spinner spinner = new Spinner(context);
		spinners.add(spinner);
		spinner.setLayoutParams(new ViewGroup.LayoutParams(WRAP_CONTENT, WRAP_CONTENT));
//		spinner.setAdapter(adapter);
		vg.addView(spinner); //スピナー追加
		vg.addView(radioGroup); //ラジオボタンを追加
		
		return vg;
	}

	public int getSize(){
		return root.getChildCount();
	}
}

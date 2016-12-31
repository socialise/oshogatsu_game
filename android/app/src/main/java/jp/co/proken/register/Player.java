package jp.co.proken.register;

public class Player {
	int point; //加点分
	String name;

	public String toJSON(){
		return "{\"name\":\"" + name + "\"" + ", \"point\":" + point + "}";
	}
}

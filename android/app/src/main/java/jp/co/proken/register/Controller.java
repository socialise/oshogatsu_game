package jp.co.proken.register;

import java.util.List;

public interface Controller {
	Player getSelected(int index);

	void addMember(List<String> names);

	void setViewGroup(int count);
}

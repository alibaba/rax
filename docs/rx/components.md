# rx-components

contains the most basic functions required for the page

* [Button](./Button.md)
* [Image](./Image.md)
* [Link](./Link.md)
* [ListView](./ListView.md)
* [RecyclerView](./RecyclerView.md)
* [RefreshControl](./RefreshControl.md)
* [ScrollView](./ScrollView.md)
* [Slider](./Slider.md)
* [Switch](./Switch.md)
* [Text](./Text.md)
* [TextInput](./TextInput.md)
* [TouchableHighlight](./TouchableHighlight.md)
* [Video](./Video.md)
* [View](./View.md)

## how to use components

import components

```
import {View, Text, ScrollView, TouchableHighlight} from '@ali/rx-components';
```

example code

```
<ScrollView>
	<View>
		<Text>Hello</Text>
	</View>
	<View>
		<Text>Components</Text>
	</View>
</ScrollView>
```

example for props

```
<TouchableHighlight onPress={()=>{}} style={{}}>
	<Text>
		Click Me
	</Text>
</TouchableHighlight>
```

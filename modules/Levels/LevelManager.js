class LevelManager {
	static async SetCurrentLevel(context, level) {
		await level.city.awake();
		context.currentLevel = level;
	}

	static ChangeLevel(currentLevel, nextLevel) {
		// DO OTHER OPERATIONS LIKE SETTIG GAME STATE AND STUFF HERE, =)
		currentLevel.end();
	}
}

export { LevelManager };

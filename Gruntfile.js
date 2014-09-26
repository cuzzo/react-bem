module.exports = function(grunt) {
  grunt.initConfig({
    react: {
      dynamic_mappings: {
        files: [
          {
            expand: true,
            cwd: "src/jsx",
            src: ["**/*.jsx"],
            dest: "src/components",
            ext: ".js"
          }
        ]
      }
    },

    watch: {
      react: {
        files: ["src/jsx/**/*.jsx"],
        tasks: ["react"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-react");
  grunt.loadNpmTasks("grunt-contrib-watch");
};

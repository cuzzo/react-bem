module.exports = function(grunt) {
  grunt.initConfig({
    react: {
      dynamic_mappings: {
        files: [
          {
            expand: true,
            cwd: "example/jsx",
            src: ["**/*.jsx"],
            dest: "example/components",
            ext: ".js"
          }
        ]
      }
    },

    watch: {
      react: {
        files: ["example/jsx/**/*.jsx"],
        tasks: ["react"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-react");
  grunt.loadNpmTasks("grunt-contrib-watch");
};

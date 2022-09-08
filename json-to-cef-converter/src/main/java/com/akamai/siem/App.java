/*
 * This Java source file was generated by the Gradle 'init' task.
 */
package com.akamai.siem;

import com.akamai.siem.constants.Constants;
import com.akamai.siem.util.SettingsUtil;
import com.akamai.siem.util.SparkUtil;
import org.apache.log4j.Logger;
import org.apache.spark.streaming.api.java.JavaStreamingContext;

import java.io.IOException;
import java.util.Map;

public class App {
    private static final Logger logger = Logger.getLogger(Constants.DEFAULT_APP_NAME);
    private static Map<String, Object> settings = null;

    static {
        try {
            settings = SettingsUtil.load();
        }
        catch(IOException e){
            logger.error(e.getMessage());
        }
    }

    public static void main(String[] args) {
        if(settings == null)
            return;

        try {
            JavaStreamingContext context = SparkUtil.getContext();

            SparkUtil.getKafkaInboundStream(context).foreachRDD(rrd -> {
                rrd.collect().forEach(message -> {
                    System.out.println(message);
                });
            });

            context.start();;
            context.awaitTermination();
        }
        catch(InterruptedException e){

        }
        catch(IOException e){
            logger.error(e.getMessage());
        }
    }
}
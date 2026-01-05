// Client-side Amplify initializer for Next.js App Router
// Reads configuration from environment variables for secure deployment

import { Amplify } from 'aws-amplify';

let configured = false;

// Build AWS config from environment variables (works in both local and production)
const envConfig = {
  aws_project_region: process.env.NEXT_PUBLIC_AWS_PROJECT_REGION,
  aws_appsync_graphqlEndpoint: process.env.NEXT_PUBLIC_AWS_APPSYNC_GRAPHQL_ENDPOINT,
  aws_appsync_region: process.env.NEXT_PUBLIC_AWS_APPSYNC_REGION,
  aws_appsync_authenticationType: process.env.NEXT_PUBLIC_AWS_APPSYNC_AUTHENTICATION_TYPE,
  aws_appsync_apiKey: process.env.NEXT_PUBLIC_AWS_APPSYNC_API_KEY,
  aws_cognito_identity_pool_id: process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID,
  aws_cognito_region: process.env.NEXT_PUBLIC_AWS_COGNITO_REGION,
  aws_user_pools_id: process.env.NEXT_PUBLIC_AWS_USERS_POOLS_ID,
  aws_user_pools_web_client_id: process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID,
  oauth: {},
  aws_cognito_username_attributes: [],
  aws_cognito_social_providers: [],
  aws_cognito_signup_attributes: ['EMAIL'],
  aws_cognito_mfa_configuration: process.env.NEXT_PUBLIC_AWS_COGNITO_MFA_CONFIGURATION || 'OFF',
  aws_cognito_mfa_types: ['SMS'],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: []
  },
  aws_cognito_verification_mechanisms: ['EMAIL'],
  aws_user_files_s3_bucket: process.env.NEXT_PUBLIC_AWS_USER_FILES_S3_BUCKET,
  aws_user_files_s3_bucket_region: process.env.NEXT_PUBLIC_AWS_USER_FILES_S3_BUCKET_REGION
};

function getAwsConfig() {
  // Check if environment variables were embedded (production)
  if (envConfig.aws_appsync_graphqlEndpoint) {
    return envConfig;
  }
  
  // Fallback to aws-exports.js for local development
  try {
    // @ts-ignore
    const awsconfig = require('../aws-exports').default || require('../aws-exports');
    return awsconfig;
  } catch (error) {
    console.error('Failed to load AWS configuration:', error);
    return null;
  }
}

export function initAmplify() {
  if (configured) return;
  
  // Guard: Only run in the browser
  if (typeof window !== 'undefined') {
    const awsconfig = getAwsConfig();
    if (!awsconfig) {
      console.error('❌ AWS configuration not available');
      console.error('Environment check:', {
        hasEndpoint: !!process.env.NEXT_PUBLIC_AWS_APPSYNC_GRAPHQL_ENDPOINT,
        endpoint: process.env.NEXT_PUBLIC_AWS_APPSYNC_GRAPHQL_ENDPOINT
      });
      return;
    }
    
    console.log('✅ Amplify configuring with:', {
      endpoint: awsconfig.aws_appsync_graphqlEndpoint,
      region: awsconfig.aws_appsync_region,
      authType: awsconfig.aws_appsync_authenticationType
    });
    
    try {
      Amplify.configure({
        ...awsconfig,
        ssr: false,
      });
      configured = true;
      console.log('✅ Amplify configured successfully');
    } catch (error) {
      console.error('❌ Amplify configuration failed:', error);
    }
  }
}
